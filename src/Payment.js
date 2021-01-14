import React from 'react'
import "./styles/Payment.css"
import { withRouter, Redirect} from "react-router-dom"

import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

import Wizard from "./components/Wizard"
import PaymentMethod from "./components/PaymentMethod"
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import TextField from '@material-ui/core/TextField'

import NumberFormat from 'react-number-format'
import axios from 'axios'

import {Helmet} from 'react-helmet'

import IsDevContext from "./components/IsDevContext"
import { loadStripe } from "@stripe/stripe-js";

import PaymentAccordion from "./components/PaymentAccordion"

const stripePromise = loadStripe("pk_live_51HVx0uASnE2FGwMVplQ5vQs8satI50YtKJOJ3wLhdQTJ4FDKtWuvvOiHDaD2vPTSb2GZD4XfF6CS6Gl2ULeZWrtd00uwghvNgC");

class Payment extends React.Component {

	constructor(){
		super()
		this.state={

			userId: "",

			firstName: "",
			lastName: "",
			address: "",
			city: "",
			town: "",
			email: "",
			postalCode: "",
			nif: "",
			phoneNumber: "",
			activeStep: 0,
			method: "cc",
			useShippingAddress: true,
			billingAddress: "",
			billingPostalCode: "",
			billingCity: "",
			billingTown: "",
			hasAcceptedTermsAndConditions:false,
			hasAcceptedNewsletterSubscription:false,
			mbWayPhoneNumber: "",

			//ERROR DEALING STATES
			hasErrorName: false,
			hasErrorSurname:false,
			hasErrorAddress:false,
			hasErrorPostalCode:false,
			hasErrorNif:false,
			hasErrorPhoneNumber:false,
			hasErrorEmail:false,
			hasErrorCity:false,
			hasErrorTown:false,
			hasErrorBillingAddress:false,
			hasErrorBillingCity:false,
			hasErrorBillingTown:false,
			hasErrorBillingPostalCode:false,
			hasErrorAcceptedTermsAndConditions:false,
			hasErrorMbWayPhoneNumber: false,

			nameErrorMessage: "",
			surnameErrorMessage: "",
			addressErrorMessage: "",
			postalCodeErrorMessage: "",
			nifErrorMessage: "",
			phoneNumberErrorMessage: "",
			emailErrorMessage: "",
			cityErrorMessage: "",
			townErrorMessage: "",
			acceptedTermsAndConditionsErrorMessage: "",
			mbWayPhoneNumberErrorMessage: "",

			billingAddressErrorMessage: "",
			billingTownErrorMessage: "",
			billingCityErrorMessage: "",
			billingPostalCodeErrorMessage: "",

			isLoading:false,
			redirectToConfirmationMb:false,

		}
	}

	static contextType = IsDevContext

	async componentDidMount(){
		const {location} = this.props

		this.setState({
			userId: location.state.userId
		})

		//console.log("context", this.context)

	}

	getSteps = () => {
	  	return ['Dados Pessoais', 'Morada', 'Método de pagamento', 'Resumo']
	}

	handleNextStep = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep + 1,
		}))
	}

	handleBackStep = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep - 1,
		}))
	}

	handleMethodChange = (value) => {
		this.setState({
			method: value
		})
	}

	handleEmailChange = (event) => {
		this.setState({
			email:event.target.value,
			hasErrorEmail:false
		})
	}

	showEmailError = () => {
		this.setState({
			hasErrorEmail:true,
			emailErrorMessage:"Email inválido"
		})
	}

	handlePhoneNumberChange = (event) => {
		this.setState({
			phoneNumber:event.target.value,
			mbWayPhoneNumber:event.target.value,
			hasErrorPhoneNumber:false
		})
	}

	handleMbWayPhoneNumberChange = (event) => {
		this.setState({
			mbWayPhoneNumber:event.target.value,
			hasErrorMbWayPhoneNumber:false
		})
	}

	showPhoneNumberError = () => {
		this.setState({
			hasErrorPhoneNumber:true,
			phoneNumberErrorMessage:"Nº telefone inválido"
		})
	}

	handleFirstNameChange = (event) => {
		this.setState({
			firstName: event.target.value,
			hasErrorName:false
		})
	}

	showFirstNameError = () => {
		this.setState({
			hasErrorName:true,
			nameErrorMessage:"Nome inválido"
		})
	}

	handleLastNameChange = (event) => {
		this.setState({
			lastName: event.target.value,
			hasErrorSurname:false
		})
	}

	showLastNameError = () => {
		this.setState({
			hasErrorSurname:true,
			surnameErrorMessage:"Apelido inválido"
		})
	}

	handleAddressChange = (event) => {
		this.setState({
			address: event.target.value,
			billingAddress: this.state.useShippingAddress && event.target.value,
			hasErrorAddress: false,
		})
	}

	showAddressError = () => {
		this.setState({
			hasErrorAddress:true,
			addressErrorMessage:"Morada inválida"
		})
	}

	handlePostalCodeChange = (event) => {
		this.setState({
			postalCode: event.target.value,
			billingPostalCode: this.state.useShippingAddress && event.target.value,
			hasErrorPostalCode:false
		})
	}

	showPostalCodeError = () => {
		this.setState({
			hasErrorPostalCode:true,
			postalCodeErrorMessage:"Código Postal inválido"
		})
	}

	handleNifChange = (event) => {
		this.setState({
			nif: event.target.value
		})
	}

	handleCityChange = (event) => {
		this.setState({
			city: event.target.value,
			billingCity: this.state.useShippingAddress && event.target.value,
			hasErrorCity:false
		})
	}

	showCityError = () => {
		this.setState({
			hasErrorCity:true,
			cityErrorMessage:"Cidade inválida"
		})
	}

	handleTownChange = (event) => {
		this.setState({
			town: event.target.value,
			billingTown: this.state.useShippingAddress && event.target.value,
			hasErrorTown:false
		})
	}

	showTownError = () => {
		this.setState({
			hasErrorTown:true,
			townErrorMessage:"Localidade inválida"
		})
	}

	onChangeUseShippingAddressCheckbox = () => {
		this.setState( prevState =>{
			return{
				billingAddress: !prevState.useShippingAddress ? this.state.address : "",
				billingPostalCode: !prevState.useShippingAddress ? this.state.postalCode : "",
				billingCity: !prevState.useShippingAddress ? this.state.city : "",
				billingTown: !prevState.useShippingAddress ? this.state.town : "",
				useShippingAddress: !prevState.useShippingAddress
			}
		})
	}

	handleBillingAddressChange = (event) => {
		this.setState({
			billingAddress: event.target.value,
			hasErrorBillingAddress: false
		})
	}

	showBillingAddressError = () => {
		this.setState({
			hasErrorBillingAddress:true,
			billingAddressErrorMessage:"Morada inválida"
		})
	}

	handleBillingPostalCodeChange = (event) => {
		this.setState({
			billingPostalCode: event.target.value,
			hasErrorBillingPostalCode:false,
		})
	}

	showBillingPostalCodeError = () => {
		this.setState({
			hasErrorBillingPostalCode:true,
			townErrorMessage:"Código Postal inválido"
		})
	}

	handleBillingCityChange = (event) => {
		this.setState({
			billingCity: event.target.value,
			hasErrorBillingCity:false,
		})
	}

	showBillingCityError = () => {
		this.setState({
			hasErrorBillingCity:true,
			billingCityErrorMessage:"Cidade inválida"
		})
	}

	showMbWayPhoneNumberError = () => {
		this.setState({
			hasErrorMbWayPhoneNumber:true,
			mbWayPhoneNumberErrorMessage:"Nº Telefone Inválido"
		})
	}

	handleBillingTownChange = (event) => {
		this.setState({
			billingTown: event.target.value,
			hasErrorBillingTown: false
		})
	}

	showBillingTownError = () => {
		this.setState({
			hasErrorBillingTown:true,
			billingTownErrorMessage:"Localidade inválida"
		})
	}

	handleHasAcceptedTermsAndConditions = () => {
		this.setState( prevState =>{
			return{
				hasAcceptedTermsAndConditions: !prevState.hasAcceptedTermsAndConditions,
				hasErrorAcceptedTermsAndConditions:false
			}
		})
	}

	showAcceptedTermsAndConditionsError = () => {
		this.setState({
			hasErrorAcceptedTermsAndConditions:true,
			acceptedTermsAndConditionsErrorMessage:"É necessário concordar com os termos e condições do site"
		})
	}

	handleHasAcceptedNewsletterSubscription = () => {
		this.setState( prevState =>{
			return{
				hasAcceptedNewsletterSubscription: !prevState.hasAcceptedNewsletterSubscription
			}
		})
	}

	setBillingAddress = () => {
		this.setState({
			billingAddress: this.state.address,
			billingCity: this.state.city,
			billingPostalCode: this.state.postalCode,
			billingTown: this.state.town,
		})
	}

	submitPayment = async() => {

		//console.log("submitPayment")
		
		this.setState({
			isLoading: true
		})

		const {location} = this.props


		let apiUrl = ''


		if(this.state.method !== "cc"){
			
			// Development
			if(this.context === true){
				apiUrl = 'http://localhost:5001/oxyllus-prd-96f49/us-central1/singlePay'
			}
			// Production
			else{
				apiUrl = 'https://us-central1-oxyllus-prd-96f49.cloudfunctions.net/singlePay'
			}

			//console.log("location.state.userId", location.state.userId)
			//console.log("this.state.userId", this.state.userId)

			//axios.post('http://localhost:5001/lusthub-98612/us-central1/singlePay', {
			axios.post(apiUrl, {
				// To be used as Customer Id for easypay
				userId: location.state.userId,

			    value: parseFloat(location.state.price),
			    method: this.state.method,
			    name: this.state.firstName,
			    surname: this.state.lastName,
			    email: this.state.email,
			    phoneNumber: this.state.phoneNumber,
			    nif: this.state.nif,

			    shippingAddress: this.state.address,
		    	shippingCity: this.state.city,
				shippingPostalCode: this.state.postalCode,
				shippingTown: this.state.town,

		    	billingAddress:this.state.billingAddress,
		    	billingCity: this.state.billingCity,
		    	billingPostalCode:this.state.billingPostalCode,
		    	billingTown: this.state.billingTown,

			    mbWayPhoneNumber: this.state.method === "mbw" ? this.state.mbWayPhoneNumber : "",

		    	hasAcceptedNewsletterSubscription: this.state.hasAcceptedNewsletterSubscription,

		    	status:"Successfully sent, pending confirmation",
		    	cart:JSON.stringify(location.state.cart),
		    	cartAmount: parseInt(location.state.cartAmount)
			})
			.then(response => {

				if(this.state.method === "mb"){
			   		//console.log("inside redirect!")
			   		this.setState({
			   			isLoading:false,
			   			price: location.state.price * location.state.type,
			   			entity: response.data.method.entity,
			   			reference: response.data.method.reference,
			   			redirectToConfirmationMb: true,
			   		})
			   	}
			   	else if(this.state.method === "mbw"){
			   		this.setState({
			   			isLoading:false,
			   			redirectToConfirmationMb: true,
			   		})
			   	}

			})
			.catch(error => {
			    //console.log(error)

				if(this.state.method === "mbw"){
			   		this.setState({
			   			isLoading:false,
			   			mbWayPhoneNumberErrorMessage: "Número inválido para Pagamento MB-Way",
			   			hasErrorMbWayPhoneNumber:true,
			   			activeStep:2,
			   		})
			   	}
			})
		}
		else{

			const stripe = await stripePromise

			// Development
			if(this.context === true){
				apiUrl = 'http://localhost:5001/oxyllus-prd-96f49/us-central1/stripeCardCheckout'
			}
			// Production
			else{
				apiUrl = 'https://us-central1-oxyllus-prd-96f49.cloudfunctions.net/stripeCardCheckout'
			}

			axios.post(apiUrl, {
				userId: location.state.userId,
			    method: this.state.method,
			    deliveryCost: location.state.deliveryCost,
			    name: this.state.firstName,
			    surname: this.state.lastName,
			    email: this.state.email,
			    address: this.state.address,
			    postalCode: this.state.postalCode,
			    city: this.state.city,
			    town: this.state.town,
			    firstCartObject: location.state.cart[0],
			    phone: this.state.phoneNumber,
			    nif: this.state.nif,

			    shippingAddress: this.state.address,
		    	shippingCity: this.state.city,
				shippingPostalCode: this.state.postalCode,
				shippingTown: this.state.town,

		    	billingAddress:this.state.billingAddress,
		    	billingCity: this.state.billingCity,
		    	billingPostalCode:this.state.billingPostalCode,
		    	billingTown: this.state.billingTown,

		    	mbWayPhoneNumber: this.state.method === "mbw" ? this.state.mbWayPhoneNumber : "",

		    	paymentMethod: this.state.method,
		    	orderPrice: parseFloat(location.state.price),
		    	hasAcceptedNewsletterSubscription: this.state.hasAcceptedNewsletterSubscription,

		    	status:"Successfully sent, pending confirmation",
		    	cart:JSON.stringify(location.state.cart),
		    	cartAmount: parseInt(location.state.cartAmount)

			})
			.then(async response => {
				const session = await response

			    // When the customer clicks on the button, redirect them to Checkout.
			    const result = await stripe.redirectToCheckout({
			      sessionId: session.data.id,
			    })
				console.log(response)
			    if (result.error) {
			    	console.log(result.error.message)
			    }
			})
			.catch(function (error) {
			    console.log(error)
			})
		}
	}

	getStepContent = (stepIndex) => {

		const {location} = this.props

		switch (stepIndex) {
		    case 0:
		     	return (
		     		<div className="mt-5 wizardMainDiv">
			     		<div className="paymentFormDiv">
			     			<h5>Por favor, insira os seus dados pessoais:</h5>
				     		<form className="mt-4">
				     			<div className="row">
				     				<div className="col-md">
								     	<div className="form-group">
									        <TextField
									        	id="outlined-basic"
									        	value={this.state.firstName}
									        	onChange={this.handleFirstNameChange}
									        	error={this.state.hasErrorName}
						          				helperText={this.state.nameErrorMessage}
									        	label="Nome"
									        	variant="outlined"
									        	required
									        />
									    </div>
									</div>
									<div className="col-md">
									    <div className="form-group">
									        <TextField
									        	id="outlined-basic"
									        	value={this.state.lastName}
									        	onChange={this.handleLastNameChange}
									        	error={this.state.hasErrorSurname}
						          				helperText={this.state.surnameErrorMessage}
									        	label="Sobrenome"
									        	variant="outlined"
									        	required
									        />
									    </div>
									</div>
							    </div>
							    <div className="row">
				     				<div className="col-md">
								     	<div className="form-group">
									        <TextField
									        	id="outlined-basic"
									        	value={this.state.email}
									        	onChange={this.handleEmailChange}
									        	error={this.state.hasErrorEmail}
						          				helperText={this.state.emailErrorMessage}
									        	label="Email"
									        	variant="outlined"
									        	required
									        />
									    </div>
									</div>
									<div className="col-md">
									    <div className="form-group">
									        <TextField
									        	id="outlined-basic"
									        	value={this.state.phoneNumber}
									        	onChange={this.handlePhoneNumberChange}
									        	error={this.state.hasErrorPhoneNumber}
									        	helperText={this.state.phoneNumberErrorMessage}
									        	label="Nº Telefone"
									        	variant="outlined"
									        	required
									        />
									    </div>
									</div>
							    </div>
							    <div className="row">
							    	<div className="col-md">
								    	<div className="form-group">
									        <TextField
									        	id="outlined-basic"
									        	value={this.state.nif}
									        	onChange={this.handleNifChange}
									        	label="NIF"
									        	variant="outlined"
									        />
									    </div>
									</div>        
								</div>
								<div className="row">
									<div className="col-md">
										<FormControl error={this.state.hasErrorAcceptedTermsAndConditions} helperText={this.state.acceptedTermsAndConditionsErrorMessage} >
											<FormControlLabel
										        control={
										        	<Checkbox
											            checked={this.state.hasAcceptedTermsAndConditions}
											            onChange={this.handleHasAcceptedTermsAndConditions}
											            name="checkedB"
											            color="primary"
											            required
										          	/>
										        }
										        label="Concordo com os Termos e Condições em vigôr no site."
										    />
										    {this.state.hasErrorAcceptedTermsAndConditions && <FormHelperText>É necessário concordar com os termos e condições do site</FormHelperText>}
										</FormControl>
									</div>
								</div>
								<div className="row">
									<div className="col-md">
										<FormControlLabel
									        control={
									        	<Checkbox
										            checked={this.state.hasAcceptedNewsletterSubscription}
										            onChange={this.handleHasAcceptedNewsletterSubscription}
										            name="checkedB"
										            color="primary"
									          />
									        }
									        label="Pretendo subscrever à newsletter com atualizações sobre novos produtos e campanhas!"
									      />
									</div>
								</div>
						    </form>
						</div>
					</div>
		     	)
		    case 1:
		     	return (
		     		<div className="mt-5 wizardMainDiv">
			     		<div className="paymentFormDiv">
			     			<h5>Morada de envio da encomenda:</h5>
				     		<form className="mt-4">
								<div className="row">
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.address}
										    	onChange={this.handleAddressChange}
										    	error={this.state.hasErrorAddress}
						          				helperText={this.state.addressErrorMessage}
										    	label="Morada"
										    	variant="outlined"
										    	required
										    />
										</div>
									</div>
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.city}
										    	onChange={this.handleCityChange}
										    	error={this.state.hasErrorCity}
						          				helperText={this.state.cityErrorMessage}
										    	label="Cidade"
										    	variant="outlined"
										    	required
										    />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md">
										<div className="form-group">
											<NumberFormat
												value={this.state.postalCode}
												customInput={TextField}
												format="####-###"
												error={this.state.hasErrorPostalCode}
						          				helperText={this.state.postalCodeErrorMessage}
										    	id="outlined-basic"
										    	onChange={this.handlePostalCodeChange}
										    	label="Código Postal"
										    	variant="outlined"
										    	required
											/>
										</div>
									</div>
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.town}
										    	onChange={this.handleTownChange}
										    	error={this.state.hasErrorTown}
						          				helperText={this.state.townErrorMessage}
										    	label="Localidade"
										    	variant="outlined"
										    	required
										    />
										</div>
									</div>
								</div>
						    </form>

						    <h5 className="mt-5">Morada de Faturação:</h5>
				     		<form className="mt-2">
				     			<div className="row">
									<div className="col-md">
										<FormControlLabel
									        control={
									        	<Checkbox
										            checked={this.state.useShippingAddress}
										            onChange={this.onChangeUseShippingAddressCheckbox}
										            name="checkedB"
										            color="primary"
									          />
									        }
									        label="Usar Morada de Envio"
									      />
									</div>
								</div>
								{!this.state.useShippingAddress &&
								<div className="row">
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.billingAddress}
										    	onChange={this.handleBillingAddressChange}
										    	error={this.state.hasErrorBillingAddress}
						          				helperText={this.state.billingAddressErrorMessage}
										    	label="Morada"
										    	variant="outlined"
										    	disabled={this.state.useShippingAddress}
										    	required
										    />
										</div>
									</div>
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.billingCity}
										    	onChange={this.handleBillingCityChange}
										    	error={this.state.hasErrorBillingCity}
						          				helperText={this.state.billingCityErrorMessage}
										    	label="Cidade"
										    	variant="outlined"
										    	disabled={this.state.useShippingAddress}
										    	required
										    />
										</div>
									</div>
								
								</div>
								}
								{!this.state.useShippingAddress &&
								<div className="row">
									<div className="col-md">
										<div className="form-group">
											<NumberFormat
												value={this.state.billingPostalCode}
												customInput={TextField}
												format="####-###"
												error={this.state.hasErrorBillingPostalCode}
						          				helperText={this.state.billingPostalCodeErrorMessage}
										    	id="outlined-basic"
										    	onChange={this.handleBillingPostalCodeChange}
										    	label="Código Postal"
										    	variant="outlined"
										    	disabled={this.state.useShippingAddress}
										    	required
											/>
										</div>
									</div>
									
									<div className="col-md">
										<div className="form-group">
										    <TextField
										    	id="outlined-basic"
										    	value={this.state.billingTown}
										    	onChange={this.handleBillingTownChange}
										    	error={this.state.hasErrorBillingTown}
						          				helperText={this.state.billingTownErrorMessage}
										    	label="Localidade"
										    	variant="outlined"
										    	required
										    	disabled={this.state.useShippingAddress}
										    />
										</div>
									</div>
								</div>
								}
						    </form>
						</div>
					</div>
		     	)
		     case 2:
		     	return (
		     		<PaymentMethod
		     	 		handleMethodChange={this.handleMethodChange}
		     	 		method={this.state.method}
		     	 		handleMbWayPhoneNumberChange={this.handleMbWayPhoneNumberChange}
		     	 		mbWayPhoneNumber={this.state.mbWayPhoneNumber}
		     	 		hasErrorMbWayPhoneNumber = {this.state.hasErrorMbWayPhoneNumber}
		     	 		mbWayPhoneNumberErrorMessage = {this.state.mbWayPhoneNumberErrorMessage}
		     	 	/>
		     	)
		    case 3:
		     	return (
		     	 	<div className="container">
		     	 		<div className="card mt-4 cardSummary" >
					  		<div className="card-body">
							    <h5 className="card-title text-dark"><b>{`Dados Pessoais:`}</b></h5>
							    <div className="paymentSummaryCardDetails">
								    <span className="card-text text-dark">{`Nome: ${this.state.firstName + " " + this.state.lastName}`}</span>
								    <span className="card-text text-dark">{`Email: ${this.state.email}`}</span>
								    <span className="card-text text-dark">{`Nº Telefone: ${this.state.phoneNumber}`}</span>
								    <span className="card-text text-dark">{`Nif: ${this.state.nif !== "" ? this.state.nif : " - "}`}</span>
								</div>
					  		</div>
						</div>
		     	 		<div className="card mt-3 cardSummary" >
					  		<div className="card-body">
							    <h5 className="card-title text-dark"><b>{`${this.state.useShippingAddress ? "Morada Encomenda/Faturação:" : "Morada Encomenda"}`}</b></h5>
							    <div className="paymentSummaryCardDetails">
								    <span className="card-text text-dark">{`${this.state.address}`}</span>
								    <span className="card-text text-dark">{`Cidade: ${this.state.city}`}</span>
								    <span className="card-text text-dark">{`Código Postal: ${this.state.postalCode + " " + this.state.town}`}</span>
								</div>
								{this.state.useShippingAddress === false &&
									<React.Fragment>
										<hr className="mt-2 mb-2"></hr>
										<h5 className="card-title text-dark"><b>Morada Faturação:</b></h5>
									    <div className="paymentSummaryCardDetails">
										    <span className="card-text text-dark">{`${this.state.address}`}</span>
										    <span className="card-text text-dark">{`Cidade: ${this.state.city}`}</span>
										    <span className="card-text text-dark">{`Código Postal: ${this.state.postalCode + " " + this.state.town}`}</span>
										</div>
									</React.Fragment>
								}
					  		</div>
						</div>
		     	 		<div className="card mt-3 mb-4 cardSummary" >
					  		<div className="card-body">
							    <h5 className="card-title text-dark"><b>{`Método de Pagamento:`}</b></h5>
							    <div className="paymentSummaryCardDetails">
								    <span className="card-text text-dark">{`${this.state.method === "cc" ? "Cartão de Crédito" : (this.state.method === "mb" ? "Multibanco" : "MB-Way")}`}</span>
								</div>
					  		</div>
						</div>
						
						<PaymentAccordion className="cardSummary" price={location.state.price} cart={location.state.cart}/>

		     	 		{this.state.method === "cc" ?
								<div className="card mt-5 paymentInformationCard">
				    				<div className="card-body text-center">
		    							<p> Será reincaminhado para a plataforma da Stripe para efetuar o pagamento.</p>
		  							</div>
								</div>
						:
						(this.state.method === "mb" &&
								<div className="card mt-5 paymentInformationCard">
				    				<div className="card-body text-center">
		    							<p> Ser-lhe-á indicado uma entidade e referência para transferência assim que terminar o pedido.</p>
		  							</div>
								</div>
							)
						}

		     	 	</div>
		     	)
		    
		    default:
		    	  return 'Unknown stepIndex'
		}
	}


	render(){

		const { location } = this.props

		console.log("billingAddress", this.state.billingAddress)

		//console.log("activeStep", this.state.activeStep)

		return(
			<>
			<Helmet>
	    		<title>Oxyllus - Checkout</title>
    			{/*<meta name="description" content="Página de Checkout e Pagamento da encomenda" />*/}
    		</Helmet>
			{this.props.hasStock ?
				<>
					<div className="container-fluid paymentDiv">
						<Backdrop open={this.state.isLoading}>
        					<CircularProgress color="primary" />
      					</Backdrop>
						
						<h1 className="text-center">Checkout</h1>
						<hr className="titleHr"></hr>

						<Wizard
							getSteps={this.getSteps}
							activeStep={this.state.activeStep}
							handleNextStep={this.handleNextStep}
							handleBackStep={this.handleBackStep}
							getStepContent={this.getStepContent}
							method={this.state.method}
							phoneNumber={this.state.phoneNumber}
							firstName={this.state.firstName}
							lastName={this.state.lastName}
							email={this.state.email}
							hasAcceptedTermsAndConditions={this.state.hasAcceptedTermsAndConditions}
							address={this.state.address}
							city={this.state.city}
							postalCode={this.state.postalCode}
							town={this.state.town}
							billingAddress={this.state.billingAddress}
							billingCity={this.state.billingCity}
							billingPostalCode={this.state.billingPostalCode}
							billingTown={this.state.billingTown}
							mbWayPhoneNumber={this.state.mbWayPhoneNumber}
							showFirstNameError={this.showFirstNameError}
							showLastNameError={this.showLastNameError}
							showEmailError={this.showEmailError}
							showPhoneNumberError={this.showPhoneNumberError}
							showAddressError={this.showAddressError}
							showPostalCodeError={this.showPostalCodeError}
							showCityError={this.showCityError}
							showTownError={this.showTownError}
							showBillingAddressError={this.showBillingAddressError}
							showBillingCityError={this.showBillingCityError}
							showBillingPostalCodeError={this.showBillingPostalCodeError}
							showBillingTownError={this.showBillingTownError}
							showAcceptedTermsAndConditionsError={this.showAcceptedTermsAndConditionsError}
							showMbWayPhoneNumberError={this.showMbWayPhoneNumberError}
							submitPayment={this.submitPayment}
							useShippingAddress={this.state.useShippingAddress}
							setBillingAddress={this.setBillingAddress}
						/>

					</div>
					{this.state.redirectToConfirmationMb &&
		      			<Redirect to={{
		      				pathname: "/ConfirmationMb",
		    				state: {
		    					name: this.state.firstName,
		    					surname: this.state.lastName,
		    					email: this.state.email,
		    					hasAcceptedNewsletterSubscription: this.state.hasAcceptedNewsletterSubscription,
		    					price: location.state.price,
		    					method: this.state.method,
		    					entity: this.state.entity,
		    					reference: this.state.reference,
		    				}
		      			}}
		      			/>
		      		}
		      		
	      		</>
	      	:
		  		<div className="container card mt-5">
		  			<div className="card-body">
						<h2 className="cardTitle text-center text-dark">Produto Esgotado...</h2>
					</div>
		  			<h5 className="text-center text-dark">Talvez tenha chegado tarde! Por favor tente novamente mais tarde ou espere pelos novos produtos que sairão brevemente!</h5>
		  		</div>
	      	}
      		</>
		)
	}
}

export default withRouter(Payment)