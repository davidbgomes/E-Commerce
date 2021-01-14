const functions = require('firebase-functions')
const https = require('https')
const express = require('express')
const cors = require('cors')({ origin: true })
const axios = require('axios')
const admin = require('firebase-admin');
const {Storage} = require('@google-cloud/storage')
var moment = require('moment')
var timezone = require('moment-timezone')
var retry = require("async/retry")
const stripe = require('stripe')(functions.config().stripe.key)

const nodemailer = require('nodemailer')

admin.initializeApp()

const db = admin.firestore()

const isDev = false

// Setup nodemailer with GMail Account to send emails upon payment
let transporter = nodemailer.createTransport({
	host: functions.config().nodemailer.host,
	port: 587,
	auth: {
		user: functions.config().nodemailer.user,
		pass: functions.config().nodemailer.pass
	}
})


exports.singlePay = functions.https.onRequest((request, response) =>{

	// use cors to get request body!
	cors(request, response, () => {

		axios.post('https://api.prod.easypay.pt/2.0/single/', {
			method: request.body.method,
			value: request.body.value,
			customer:{
				name: request.body.name + " " + request.body.surname,
				email: request.body.email,
				phone: request.body.method === "mbw" ? request.body.mbWayPhoneNumber : request.body.phoneNumber,
				fiscal_number: request.body.nif,
				key: request.body.userId
			},
			capture:{
				descriptive: 'Compra Oxyllus.pt'
			}
		},{
			headers:{
				'AccountId': functions.config().easypay.account_id,
				'ApiKey': functions.config().easypay.api_key,
				'Content-Type': 'application/json'
			}
		}
		)
		.then(async res => {

			await db.collection("Users").doc(request.body.userId).collection("Orders").doc(moment().format()).set({
		    	OrderId: res.data.id,
		    	CustomerId:res.data.customer.id,
		    	Name:request.body.name,
		    	Surname:request.body.surname,
		    	Email: request.body.email,
		    	PhoneNumber: request.body.phoneNumber,
				Nif: request.body.nif,

		    	ShippingAddress: request.body.shippingAddress,
		    	ShippingCity: request.body.shippingCity,
				ShippingPostalCode: request.body.shippingPostalCode,
				ShippingTown: request.body.shippingTown,

		    	BillingAddress:request.body.billingAddress,
		    	BillingCity: request.body.billingCity,
		    	BillingPostalCode:request.body.billingPostalCode,
		    	BillingTown: request.body.billingTown,

		    	MbWayPhoneNumber: request.body.mbWayPhoneNumber,

		    	PaymentMethod: request.body.method,
		    	OrderPrice: request.body.value,
		    	HasAcceptedNewsletterSubscription: request.body.hasAcceptedNewsletterSubscription,

		    	Status:"Successfully sent, pending confirmation",
		    	OrderCreatedOn:admin.firestore.FieldValue.serverTimestamp(),
		    	Cart:request.body.cart,
		    	CartAmount: request.body.cartAmount
		    }, { merge: true })

		    if(request.body.method === "mb"){
		    	sendMultibancoDetailsEmail(request.body.email, request.body.name, request.body.value, res.data.method.entity, res.data.method.reference)
		    }

			//let url = (res.data.method.url)

		    //console.log("DATA", res.data.message)
		    //console.log("res.data", res.data)
		    response.status(200).send(res.data)
		    return null
		})
		.catch(error => {
			console.log("error", error.message)
			response.status(400).end()
		})
	})
})

//ONLY RUNS WHEN CALLED BY EASYPAY NOTIFICATION
exports.getSinglePay = functions.https.onRequest(async (request, response) =>{

	let hasActiveProduct = true

	console.log("request.body.customer", request.body.customer)

	await db.collection("Users").doc(request.body.customer.key).collection("Orders").where("OrderId", "==", request.body.id).where("Status", "==", "Successfully sent, pending confirmation").get()
	.then( querySnapshot => {
		querySnapshot.forEach(async doc => {

			//DECREMENT THE CART AMOUNT FROM THE PRODUCT STOCK
			await db.collection("Products").where("IsActive", "==", true).get()
			.then(async querySnapshot =>{
				querySnapshot.forEach(productDoc =>{
					let currentStockValue = productDoc.data().CurrentStock

					console.log("currentStockValue", currentStockValue)
					console.log("doc.data().CartAmount", doc.data().CartAmount)
					console.log("currentStockValue - doc.data().CartAmount", currentStockValue - doc.data().CartAmount)
					if(currentStockValue - doc.data().CartAmount === 0){
						hasActiveProduct = false
					}

					productDoc.ref.update({
						CurrentStock: admin.firestore.FieldValue.increment(- doc.data().CartAmount),
						IsActive: currentStockValue - doc.data().CartAmount === 0 ? false : true,
					})
				})


				//INCREASE THE 'TREE PLANTED' COUNTER
				await db.collection("Statistics").doc("StatsDoc").update({
					TreesPlanted: admin.firestore.FieldValue.increment(doc.data().CartAmount)
				})

				db.collection("Users").doc(request.body.customer.key).collection("Orders").doc(doc.id).set({
					PaidOn: moment().format(),
					Status: "Paid",
				}, { merge: true })

				sendSuccessEmail(doc.data().Email, doc.data().Name, doc.data().Cart, doc.data().OrderPrice, doc.data().OrderId, doc.data().PaymentMethod, moment().format("DD-MM-YYYY HH:mm"))


				const deliveryAddress = {
					address: doc.data().ShippingAddress,
					city: doc.data().ShippingCity,
					postalCode: doc.data().ShippingPostalCode + " " + doc.data().ShippingTown
				}
				const billingAddress = {
					address: doc.data().BillingAddress,
					city: doc.data().BillingCity,
					postalCode: doc.data().BillingPostalCode + " " + doc.data().BillingTown
				}
				const fullName = doc.data().Name + " " + doc.data().Surname

				sendNewOrderEmail(fullName, doc.data().Nif, doc.data().Cart, doc.data().OrderPrice, deliveryAddress, billingAddress, doc.data().OrderId, doc.data().PaymentMethod, moment().format("DD-MM-YYYY HH:mm"))

				// IF NO MORE STOCK IS LEFT, THEN CANCEL ALL OF THE EXISTING PENDING SINGLEPAYS, IN ORDER TO NOT HAVE SOMEONE PAY FOR A PRODUCT OUT OF STOCK
				if(hasActiveProduct === false){

					console.log("------------------------")
					console.log("No more active Products!")
					console.log("------------------------")

					let Array_OrderId = []

					await db.collectionGroup("Orders").where("Status", "==", "Successfully sent, pending confirmation").get()
					.then( async querySnapshot => {
						querySnapshot.forEach(async doc => {
							doc.ref.update({
								Status: "Canceled. No more products in stock"
							})
							Array_OrderId.push(doc.data().OrderId)
						})
						await cancelPendingOrders(Array_OrderId)
						response.status(200).send("success")
						return null

					})
					.catch(error => {
						console.log(error)
					})
				}
				else{
					response.status(200).send("success")
				}
				return null
			})
			.catch(error => {
				response.status(406).end()
				console.log(error)
			})

		})
		return null
	})
	.catch(error => {
		response.status(406).end()
		console.log(error)
	})
})


exports.stripeCardCheckout = functions.https.onRequest((request, response) =>{


	cors(request, response, async() => {

		// SAVE THE INITIAL ORDER IN THE DB

		console.log("request.body.userId", request.body.userId)

		const orderRef = db.collection("Users").doc(request.body.userId).collection("Orders").doc(moment().format())

		await orderRef.set({
			Method: request.body.method,
		    DeliveryCost: request.body.deliveryCost,
		    Name: request.body.name,
		    Surname:request.body.surname,
		    Email: request.body.email,
		    Address: request.body.address,
		    PostalCode: request.body.postalCode,
		    City: request.body.city,
		    Town: request.body.town,
		    PhoneNumber: request.body.phone,
		    Nif: request.body.nif,

		    ShippingAddress: request.body.shippingAddress,
	    	ShippingCity: request.body.city,
			ShippingPostalCode: request.body.shippingPostalCode,
			ShippingTown: request.body.shippingTown,

	    	BillingAddress:request.body.billingAddress,
	    	BillingCity: request.body.billingCity,
	    	BillingPostalCode:request.body.billingPostalCode,
	    	BillingTown: request.body.billingTown,

	    	MbWayPhoneNumber: request.body.mbWayPhoneNumber,

	    	PaymentMethod: request.body.method,
	    	OrderPrice: request.body.orderPrice,
	    	HasAcceptedNewsletterSubscription: request.body.hasAcceptedNewsletterSubscription,

	    	Status:"Successfully sent, pending confirmation",
	    	OrderCreatedOn:admin.firestore.FieldValue.serverTimestamp(),
	    	Cart: request.body.cart,
	    	CartAmount: request.body.cartAmount
		}, { merge: true })

		//SAVE PROFILE
		await db.collection("Users").doc(request.body.userId).collection("Profile").doc("ProfileDoc").set({
			Name: request.body.name,
			Email: request.body.email,
			Address: request.body.address,
			PostalCode: request.body.postalCode,
		    City: request.body.city,
		    Town: request.body.town,
		    PhoneNumber: request.body.phone,
		    Nif: request.body.nif
		}, { merge: true })


		let clientId = ""

		console.log("request.body.userId", request.body.userId)

		//GET STRIPE CLIENT ID IF EXISTS
		await db.collection("Users").doc(request.body.userId).collection("Profile").doc("ProfileDoc").get()
		.then(async doc => {

			var getClientId_Promisse = new Promise(function(resolve, reject){
				if(doc.exists){
					if(doc.data().StripeClientId !== undefined){
						clientId = doc.data().StripeClientId
						resolve(clientId)
					}
					resolve("")
				}
			})

			getClientId_Promisse.then(async (res) =>{

				let customer

				console.log("CLIENT ID", clientId)

				// TRY TO UPDATE CUSTOMER, IF CLIENT HAS ALREADY BEEN CREATED
				try{
					console.log("OLD CUSTOMER")
					customer = await stripe.customers.update(
			  			doc.data().StripeClientId,
			  			{
			  				name: request.body.name + " " + request.body.surname,
				    		address: {
					    		city: request.body.city,
					    		line1: request.body.address,
					    		postal_code: request.body.postalCode,
					    		state: request.body.town
				    		},
				    		metadata:{userId: request.body.userId},
				    		email:request.body.email,
				    		phone: request.body.phone
			  			}
					)
				}
				// NEW CUSTOMER - CREATE HIM
				catch (err) {
	    			console.log("ERRORMSG: ",err)
					console.log("NEW CUSTOMER")
					customer = await stripe.customers.create({
				    	name: request.body.name + " " + request.body.surname,
				    	address: {
				    		city: request.body.city,
				    		line1: request.body.address,
				    		postal_code: request.body.postalCode,
				    		state: request.body.town
				    	},
				    	metadata:{userId: request.body.userId},
				    	email:request.body.email,
				    	phone: request.body.phone
					})

					clientId = await customer.id
					console.log("clientId", clientId)

					await db.collection("Users").doc(request.body.userId).collection("Profile").doc("ProfileDoc").set({
						StripeClientId: customer.id
					}, { merge: true })
				}

				console.log("customer", customer)
				console.log("clientId", clientId)

				let YOUR_DOMAIN
				if (isDev){
					YOUR_DOMAIN = 'http://localhost:3000/Confirmation'
				}
				else{
					YOUR_DOMAIN = 'https://oxyllus.pt/Confirmation'
				}


				const session = await stripe.checkout.sessions.create({
				    payment_method_types: ['card'],
				    locale:"pt",
				    customer: clientId,
				    line_items: [
				      {
				        price_data: {
				          	currency: 'eur',
				          	product_data: {
				            	name: request.body.firstCartObject.name,
				            	description: request.body.firstCartObject.description,
				            	images: [request.body.firstCartObject.imageUrl]
				          	},
				          	unit_amount: request.body.firstCartObject.price * 100,
				        },
				        quantity: request.body.firstCartObject.quantity
				      },
				      {
				        price_data: {
				          currency: 'eur',
				          product_data: {
				            name: "Custo de Entrega"
				          },
				          unit_amount: request.body.deliveryCost * 100,
				        },
				        quantity: 1
				      }
				    ],
				    mode: 'payment',
				    allow_promotion_codes: true,
				    success_url: `${YOUR_DOMAIN}?success=true`,
				    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
				})


				//SAVE PAYMENT INTENT
				await orderRef.set({
					OrderId: session.id,
			    	PaymentIntent: session.payment_intent,
				}, { merge: true })


				console.log("session", session)
				response.json({ id: session.id })
				return null


			})
			.catch(error =>{
				console.log("Promisse Error: ", error)
			})

		return null
			
		})
		.catch(error => {
			console.log(error)
		})
	})

})



exports.stripeConfirmPayment = functions.https.onRequest(async (request, response) =>{

	const endpointSecret = functions.config().stripe.endpoint_secret

	const payload = request.rawBody

  	console.log("Got payload: ", payload)
  	console.log("request.headers", request.headers)

  	const sig = request.headers['stripe-signature']


  	let event;

  	try {
    	event = stripe.webhooks.constructEvent(payload, sig , endpointSecret)
  		console.log("eventLog", event)
  	}
  	catch (err) {
    	console.log("ERRORMSG: ",err)
    	return response.status(400).send(`Webhook Error: ${err.message}`)
  	}


  	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		console.log("INSIDE IF!!!!!")
		// Fulfill the purchase...
		await fulfillOrder(session)
	}
  	
  	response.status(200).end()

})

async function fulfillOrder(session){

	console.log("Fulfill Order:")

	//GET CUSTOMER THAT WEBHOOK RETURNED IN THE SESSION
	const customer = await stripe.customers.retrieve(
  		session.customer
	)

	console.log("customer", customer)

	console.log("customer.metadata.userId", customer.metadata.userId)


	// GET THE ORDER THAT BELONGS TO THE CUSTOMER USER ID OF THE SESSION. USERID IS THE FIREBASE USER IDENTIFIER.
 	await db.collection("Users").doc(customer.metadata.userId).collection("Orders").where("PaymentIntent", "==", session.payment_intent).get()
	.then(async querySnapshot => {

		let hasActiveProduct

		querySnapshot.forEach(async doc => {

			//Change the Status to Paid, and set the Date
			db.collection("Users").doc(customer.metadata.userId).collection("Orders").doc(doc.id).set({
				PaidOn: moment().format(),
				Status: "Paid",
			}, { merge: true })

 			hasActiveProduct = await updateStockAndTreeCounter(doc, customer.metadata.userId)
 			
			//console.log("hasActiveProduct", updateStockAndTreeCounter(doc, customer.metadata.userId))

			sendSuccessEmail(doc.data().Email, doc.data().Name, doc.data().Cart, doc.data().OrderPrice, doc.data().OrderId, doc.data().PaymentMethod, timezone().tz("Europe/Lisbon").format("DD-MM-YYYY HH:mm"))


			const deliveryAddress = {
				address: doc.data().ShippingAddress,
				city: doc.data().ShippingCity,
				postalCode: doc.data().ShippingPostalCode + " " + doc.data().ShippingTown
			}
			const billingAddress = {
				address: doc.data().BillingAddress,
				city: doc.data().BillingCity,
				postalCode: doc.data().BillingPostalCode + " " + doc.data().BillingTown
			}
			const fullName = doc.data().Name + " " + doc.data().Surname

			sendNewOrderEmail(fullName, doc.data().Nif, doc.data().Cart, doc.data().OrderPrice, deliveryAddress, billingAddress, doc.data().OrderId, doc.data().PaymentMethod, moment().format("DD-MM-YYYY HH:mm"))
			
 		})

		// IF NO MORE STOCK IS LEFT, THEN CANCEL ALL OF THE EXISTING PENDING SINGLEPAYS, IN ORDER TO NOT HAVE SOMEONE PAY FOR A PRODUCT OUT OF STOCK
		if(hasActiveProduct === false){

			console.log("------------------------")
			console.log("No more active Products!")
			console.log("------------------------")

			let Array_OrderId = []

			await db.collectionGroup("Orders").where("Status", "==", "Successfully sent, pending confirmation").get()
			.then( async querySnapshot => {
				querySnapshot.forEach(async doc => {
					doc.ref.update({
						Status: "Canceled. No more products in stock"
					})
					Array_OrderId.push(doc.data().OrderId)
				})
				await cancelPendingOrders(Array_OrderId)
				//return response.status(200).send("success")
				return null
			})
			.catch(error => {
				console.log(error)
			})

		}
/*		else{
			return response.status(200).send("success")
		}*/
		return null
	})
	.catch(error => {
		console.log(error)
	})

}

// DECREMENTS CURRENT PRODUCT STOCK, INCREMENTS TREE COUNTER.
// RETURNS IF THERE IS STILL ACTIVE PRODUCT AFTER THIS ORDER
async function updateStockAndTreeCounter(orderDoc, userId){

	console.log("--updateStockAndTreeCounter--")

	let hasActiveProduct = true

	//DECREMENT THE CART AMOUNT FROM THE PRODUCT STOCK
	await db.collection("Products").where("IsActive", "==", true).get()
	.then(async querySnapshot =>{
		querySnapshot.forEach(productDoc =>{
			let currentStockValue = productDoc.data().CurrentStock

		/*	console.log("currentStockValue", currentStockValue)
			console.log("doc.data().CartAmount", doc.data().CartAmount)
			console.log("currentStockValue - doc.data().CartAmount", currentStockValue - doc.data().CartAmount)
		*/
			if(currentStockValue - orderDoc.data().CartAmount === 0){
				hasActiveProduct = false
			}

			productDoc.ref.update({
				CurrentStock: admin.firestore.FieldValue.increment(- orderDoc.data().CartAmount),
				IsActive: currentStockValue - orderDoc.data().CartAmount === 0 ? false : true,
			})
		})

		//INCREASE THE 'TREE PLANTED' COUNTER
		await db.collection("Statistics").doc("StatsDoc").update({
			TreesPlanted: admin.firestore.FieldValue.increment(orderDoc.data().CartAmount)
		})

		return hasActiveProduct

	})
	.catch(error => {
		console.log(error)
	})
}


exports.getConfirmationData = functions.https.onRequest(async (request, response) =>{

	cors(request, response, async() => {

		function ensureFooIsSet() {
			let retry = 1
		    return new Promise(function (resolve, reject) {
		        ( async function waitForFoo(){

		        	await db.collection("Users").doc(request.body.userId).collection("Orders").orderBy("OrderCreatedOn", "desc").limit(1).get()
					.then(async querySnapshot => {
						querySnapshot.forEach(doc => {
							console.log("Retry No. ", retry)
							console.log("---DOC STATUS---", doc.data().Status)
							if(doc.data().Status === "Paid"){
								console.log("ORDER PAID")
				            	return resolve(
				            		{
				            			name:doc.data().Name,
				            			surname:doc.data().Surname,
				            			email:doc.data().Email,
				            			hasAcceptedNewsletterSubscription:doc.data().HasAcceptedNewsletterSubscription
				            		}
				            	)
							}
							else{
								if(retry >= 15){
				            		return reject(new Error("Too many attepts, Order not paid"))
				            	}
					            console.log("ORDER NOT FOUND")
					            retry = retry + 1
					            setTimeout(waitForFoo, 5000);
							}
						})
						return null
					})
					.catch(error => {
						console.log(error)
					})
		        })();
		    })
		}
		ensureFooIsSet()
		.then(result => {
			console.log(result)
			response.status(200).json(result)
			response.end()
			return null
		})
		.catch(err => {
 			console.log('Error: ', err);
			response.status(400).send("Error")
		})
	})
})




// SETS EXPIRATION DATE ON PENDING ORDERS TO NOW, SO NO PAYMENTS ARE DONE ON THE BEHALF OF THE PERSON WHO DIDN'T GET THE PRODUCT
function cancelPendingOrders(Array_OrderId){

	console.log("Array_OrderId", Array_OrderId)

	for(let i = 0; i <= Array_OrderId.length - 1; i++){

		axios({
			method: 'get',
			url: `https://api.prod.easypay.pt/2.0/single/${Array_OrderId[i]}`,
			headers: {
				'AccountId': functions.config().easypay.account_id,
				'ApiKey': functions.config().easypay.api_key,
				'Content-Type':"application/json"
			}
		})
		.then(async res => {

			console.log("expiration_time", moment.utc(new Date).add(30,"seconds").format("YYYY-MM-DD HH:mm:ss"))

			axios.patch(`https://api.prod.easypay.pt/2.0/single/${Array_OrderId[i]}`, {
				value: res.data.value,
				method: res.data.method.type,
				expiration_time:moment.utc().add(1,"minutes").format("YYYY-MM-DD HH:mm").toString()
			},
			{
				headers:{
					'AccountId': functions.config().easypay.account_id,
					'ApiKey': functions.config().easypay.api_key,
					'Content-Type': 'application/json'
				}
			}
			)
			.then(res => {
			    //console.log(res.data)
			    console.log("inside res Data")
			    return null

			})
			.catch(error => {
				console.log(error.response)
			})
			return null
		})
		.catch(error => {
			console.log(error.response)
		})

	}
}


function sendSuccessEmail(emailTo, name, cart, orderPrice, orderId, paymentMethod, paidOn){

	console.log("Sending Email")

	var cartObj = JSON.parse(cart)

	transporter.sendMail({
		from: 'Oxyllus <oxyllus.store@gmail.com>',
		to: emailTo,
        subject: 'Pagamento efetuado com sucesso', // email subject
        html: `
        <img
        	width="140"
        	src="https://oxyllus.pt/oxyllus_LogoEmail.png"
        />
        <h2 style="color:black;margin-top:30px">Caro/a ${name},</h2>
        <h3 style="color:black">Informamos que o seu pagamento foi confirmado! Em breve receberá a encomenda em sua casa.</h3>
        <h3 style="color:black;margin-top:10px">A sua encomenda:</h3>

        <table style="width:450px;border: 1px solid #ddd;border-collapse: collapse;">
	        <thead style="background-color: black;color: white;">
		        <tr>
			        <th>Produto</th>
			        <th>Quantidade</th>
			        <th>Preço</th>
		        </tr>
	        </thead>

	        <tbody>
		        <tr>
			        <td style="text-align:center;border: 1px solid #ddd;">
				        <div style="display:inline-flex">
					        <img width="70" src=${cartObj[0].imageUrl} />
					        <p style="color:black;margin-left:10px;margin:auto;">${cartObj[0].name}</p>
				        </div>
			        </td>
			        <td style="text-align:center;border: 1px solid #ddd;"><p style="color:black">${cartObj[0].quantity}</p></td>
			        <td style="text-align:center;border: 1px solid #ddd;"><p style="color:black">${orderPrice}€</p></td>
		        </tr>
	        </tbody>
        </table>

        <div>
        <h4>Detalhes da encomenda:</h4>
        <div style="width:500px;border:groove">
	        <h4 style="color:black"><b>Nº da Encomenda:</b> ${paymentMethod === "cc" ? orderId.substring(7) : orderId} </h4>
	        <h4 style="color:black"><b>Método de pagamento:</b> ${paymentMethod === "cc" ? "Cartão de Crédito" : ""}${paymentMethod === "mb" ? "Multibanco" : ""}${paymentMethod === "mbw" ? "MB-Way" : ""} </h4>
	        <h4 style="color:black"><b>Data do pagamento:</b> ${paidOn} </h4>
        </div>

        <div>
	        <h4 style="color:black">Deverá receber a encomenda dentro de 2 dias úteis.</h4>
	        <h4 style="color:black">Caso tenha qualquer dúvida, não hesite em nos contactar respondendo a este email ou através do nosso número de telefone: 91 193 24 32.</h4>

	        <p style="color:black;font-size: 15px;">Obrigado por comprar connosco,<p/>
	        <p style="color:black;font-size: 15px;">A equipa Oxyllus<p/>
        </div>
        `
    })

}

function sendNewOrderEmail(name, nif, cart, orderPrice, deliveryAddress, billingAddress, orderId, paymentMethod, paidOn){

	console.log("Sending Email")

	var cartObj = JSON.parse(cart)

	transporter.sendMail({
		from: 'Oxyllus <oxyllus.store@gmail.com>',
		to: "davidbgomes92@gmail.com",
        subject: 'Nova Encomenda', // email subject
        html: `
        <img
        	width="140"
        	src="https://oxyllus.pt/oxyllus_LogoEmail.png"
        />
        <h2 style="color:black;margin-top:30px">Dados da encomenda:</h2>
        <div style="width:500px;border:groove">
        	<h4 style="color:black"><b>Nome do Cliente:</b> ${name} </h4>
        	<h4 style="color:black"><b>Nif:</b> ${nif !== "" ? nif : " - "} </h4>
        	<h4 style="color:black"><b>Produto:</b> ${cartObj[0].name} </h4>
        	<h4 style="color:black"><b>Quantidade:</b> ${cartObj[0].quantity} </h4>
        	<h4 style="color:black"><b>Custo da Encomenda:</b> ${orderPrice} € </h4>
        	<hr></hr>
        	<h4 style="color:black"><b>Morada de Envio:</b> ${deliveryAddress.address} </h4>
        	<h4 style="color:black"><b>Cidade de Envio:</b> ${deliveryAddress.city} </h4>
        	<h4 style="color:black"><b>Código Postal de Envio:</b> ${deliveryAddress.postalCode} </h4>
        	<hr></hr>
        	<h4 style="color:black"><b>Morada de Faturação:</b> ${billingAddress.address} </h4>
        	<h4 style="color:black"><b>Cidade de Faturação:</b> ${billingAddress.city} </h4>
        	<h4 style="color:black"><b>Código Postal de Faturação:</b> ${billingAddress.postalCode} </h4>
        	<hr></hr>
	        <h4 style="color:black"><b>Nº da Encomenda:</b> ${paymentMethod === "cc" ? orderId.substring(7) : orderId} </h4>
	        <h4 style="color:black"><b>Método de pagamento:</b> ${paymentMethod === "cc" ? "Cartão de Crédito" : ""}${paymentMethod === "mb" ? "Multibanco" : ""}${paymentMethod === "mbw" ? "MB-Way" : ""} </h4>
	        <h4 style="color:black"><b>Data do pagamento:</b> ${paidOn} </h4>
        </div>
        `
    })

}

function sendMultibancoDetailsEmail(emailTo, name, value, entity, reference){
	console.log("Sending Email")

	let referenceString = reference.substring(0,3) + " " + reference.substring(3,6) + " " + reference.substring(6)

	transporter.sendMail({
		from: 'Oxyllus <oxyllus.store@gmail.com>',
		to: emailTo,
        subject: 'Detalhes de Pagamento Multibanco', // email subject
        html: `
        <img
        	width="140"
        	src="https://oxyllus.pt/oxyllus_LogoEmail.png"
        />
        <h2 style="color:black;margin-top:30px">Caro/a ${name},</h2>
        <h3 style="color:black">Informamos que a sua Encomenda está pendente de pagamento. Enviamos em seguida os detalhes de pagamento Multibanco:</h3>

        <div style="display: inline-flex; border: groove; width: 450px;">
            <div className="card-header multibancoHeader">
                <img width="170" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Multibanco.svg/1200px-Multibanco.svg.png" alt="mb"/>
            </div>
            <div className="card-body">
                <p style="color:black;font-size: 20px;"><b>Entidade</b> : ${entity}<p/>
                <p style="color:black;font-size: 20px;"><b>Referência</b> : ${referenceString}<p/>
                <p style="color:black;font-size: 20px;"><b>Valor</b> : ${value}€<p/>
            </div>
        </div>


        <div>
        <h4 style="color:black">Informamos que esta entidade e referência estará ativa somente para este produto. Caso este já esteja esgotado, o pagamento não será efetuado.</h4>
        <br></br>
        <h4 style="color:black">Assim que efetuar o pagamento, irá receber um email de confirmação da encomenda.</h4>
        <h4 style="color:black">Caso tenha qualquer dúvida, não hesite em nos contactar respondendo a este email ou através do nosso número de telefone: 91 193 24 32.</h4>

        <p style="color:black;font-size: 15px;">Obrigado por comprar connosco,<p/>
        <p style="color:black;font-size: 15px;">A equipa Oxyllus<p/>
        </div>
        `
    })
}