import React , { Suspense, lazy } from 'react'
import './styles/App.css'
import { Switch, Route , withRouter } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadIndicatorWithDelay from "./components/LoadIndicatorWithDelay"
import { withCookies } from 'react-cookie'
import { compose } from 'recompose'
import firebase from './config/FirebaseConfig'
import _ from "lodash"


import ReactGA from 'react-ga'

import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'


const Home = lazy(() => import('./Home'))
const Confirmation = lazy(() => import('./Confirmation'))
const ConfirmationMb = lazy(() => import('./ConfirmationMb'))
const ProductList = lazy(() => import('./ProductList'))
const Cart = lazy(() => import('./Cart'))
const Payment = lazy(() => import('./Payment'))
const TermsAndConditions = lazy(() => import('./TermsAndConditions'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
const AboutUs = lazy(() => import('./AboutUs'))
const FAQs = lazy(() => import('./FAQs'))
const NotFound = lazy(() => import('./components/NotFound'))
const MessengerCustomerChat = lazy(() => import('react-messenger-customer-chat'))
const CookieSnackbar = lazy(() => import('./components/CookieSnackbar'))


class App extends React.Component {
	constructor(){
		super()
		this.state={
			userId: "",
			isHamburgerOpen: false,
			cart:[],
			deliveryCost:2.5,
			cartAmount: 0,
			products: [],
			activeProduct: {},
			treesPlanted: 0,
			startDate: null,
			countdownTimeMs: 0,
			signInError: false,
			hasProducts: false,
			hasStock: true,
			hasHomeMounted:false,

			isDataFetched:false,

			showAddProductDialog:false,
			showNewsletterDialog:false,

			hasAcceptedCookie: null,
		}
		this.toggleMenu = this.toggleMenu.bind(this)
		this.addToCart = this.addToCart.bind(this)
		this.onChangeCartItemAmount = this.onChangeCartItemAmount.bind(this)
		this.deleteCartItem = this.deleteCartItem.bind(this)
		this.updateCartAmount = this.updateCartAmount.bind(this)
		this.updateCookies = this.updateCookies.bind(this)
		this.toggleAddProductDialog = this.toggleAddProductDialog.bind(this)
		this.onCloseAddProductDialog = this.onCloseAddProductDialog.bind(this)
		this.toggleNewsletterDialog = this.toggleNewsletterDialog.bind(this)
		this.onCloseNewsletterDialog = this.onCloseNewsletterDialog.bind(this)
		this.clearCart = this.clearCart.bind(this)
		this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)
	}

	async componentDidMount(){

		const { cookies } = this.props
		// Set state as true if there is a cookie 'user_firstVisit' set
		if(cookies.get('user_firstVisit') !== undefined){
            this.setState({
                hasAcceptedCookie:true,
            })
        }

		ReactGA.initialize('UA-176389305-1');
		ReactGA.pageview(window.location.pathname)


		await firebase.auth().signInAnonymously()
		.catch(error => {
			// Handle Errors here.
			console.log(error.code, error.message)
		})

		await firebase.auth().onAuthStateChanged(user => {
			if (user) {
		    	this.setState({
		    		userId: firebase.auth().currentUser.uid
		    	})
		  	} else {
		  		this.setState({
		    		signInError: true
		    	})
		  	}
		})

		const db = firebase.firestore()

		await db.collection("Products").where("IsActive", "==", true).get()
		.then(querySnapshot => {
	        querySnapshot.forEach(doc => {
	        	this.setState({
	        		activeProduct: {id:doc.id, data:doc.data()},
	        		hasProducts: true
	        	})
		    })
		})


		if(this.state.hasProducts){
			await db.collection("Products").doc(this.state.activeProduct.id)
			.onSnapshot(doc => {
				this.setState({
					hasStock: doc.data().CurrentStock > 0 ? true : false
				})
			})
		}


		await db.collection("Products")
		.onSnapshot(querySnapshot => {

			let hasActiveProducts = false
			querySnapshot.forEach(doc => {
				
				let productThatAlreadyExists = _.find(this.state.products, {id: doc.id})

				if(productThatAlreadyExists !== undefined){
					productThatAlreadyExists.data = doc.data()
				}
				else{
					this.setState({
						products: this.state.products.concat({id:doc.id, data:doc.data()})
					})
				}

				if(doc.data().IsActive === true){
					hasActiveProducts = true

					this.setState({
		        		activeProduct: {id:doc.id, data:doc.data()},
		        		hasProducts: true
		        	})
				}
	        })
			if(hasActiveProducts === false){
				this.setState({
					activeProduct: {},
	        		hasProducts: false
	        	})
			}
		})


		await db.collection("Statistics").doc("StatsDoc")
		.onSnapshot(doc => {
			this.setState({
				treesPlanted: doc.data().TreesPlanted,
				startDate: doc.data().CounterStartDate.toDate(),
				countdownTimeMs: doc.data().CountdownTime,
				isDataFetched: true,
			})
		})

        if(cookies.get('user_cart') !== undefined){

        	let removeCookiesFlag = false
        	//console.log("this.state.activeProduct", this.state.activeProduct)

        	if(this.state.activeProduct.data === undefined || cookies.get('user_cart').cartAmount > this.state.activeProduct.data.CurrentStock){
        		console.log("Is removing 1")
        		removeCookiesFlag = true
        	}
        	else{
	        	for(let i = 0; i < cookies.get('user_cart').cart.length; i++){
	        		if(cookies.get('user_cart').cart[i].name !== this.state.activeProduct.data.Name){
	        			removeCookiesFlag = true
	        			//console.log("Is removing 2")
	        		}

	        	}
        	}


        	if(removeCookiesFlag){
        		cookies.remove('user_cart')
        	}
        	else{
        		this.setState({
        			cart:cookies.get('user_cart').cart,
        			cartAmount:cookies.get('user_cart').cartAmount
        		})
        	}

        }
	}

	async addToCart(productName, productPrice, productQuantity, productDescription, productImageUrl){

		// If already has that product in the cart, just add to its quantity and save the updated cookie. 
		if(_.some(this.state.cart, {name:productName})){
			let sameObject = _.find(this.state.cart, { 'name': productName})
			// Limit the shopping cart to 15 items
			if(this.state.cartAmount + parseInt(productQuantity, 10) <= 15){
				sameObject.quantity = sameObject.quantity + parseInt(productQuantity, 10)
			}
			// If the amount added is more than 15, just maintain 15 as cart amount
			else{
				sameObject.quantity = 15
			}

			this.updateCartAmount()

		}

		//If it's a new product, just add it to the state and set the cookie
		else{
			this.setState({
					cart:this.state.cart.concat({name:productName, price: productPrice, quantity:parseInt(productQuantity, 10), description:productDescription, imageUrl: productImageUrl}),
			}, () => this.updateCartAmount())
		}
	
	}

	onChangeCartItemAmount(quantity, productName){
		if(quantity >= 1){
			let sameObject = _.find(this.state.cart, { 'name': productName})
			sameObject.quantity = parseInt(quantity, 10)

			this.updateCartAmount()
		}
	}

	async updateCartAmount(){
		/*console.log("updateCartAmount")
		console.log("_.size(this.state.cart)", _.size(this.state.cart))*/
		var cartAmount = 0
		if(_.size(this.state.cart) > 0){
			await Object.keys(this.state.cart).map((item, i) => (
				cartAmount = cartAmount + parseInt(this.state.cart[item].quantity, 10)
			))
		}
		this.setState({
			cartAmount: cartAmount
		}, () => this.updateCookies(this.state.cartAmount))
	}

	updateCookies(productQuantity){
		const { cookies } = this.props
		cookies.set('user_cart', { path: '/' , cart:this.state.cart, cartAmount:parseInt(productQuantity, 10)})
	}

	async deleteCartItem(productName){

		this.setState({
			cart: _.filter(this.state.cart, !{ 'name': productName})
		}, () => this.updateCartAmount())
	}

	toggleMenu(){
		this.setState(prevState =>{
			return{
				isHamburgerOpen: !prevState.isHamburgerOpen
			}
		})
	}

	toggleAddProductDialog(){
		if(this.state.cartAmount < 15){
			this.setState(prevState =>{
				return{
					showAddProductDialog: !prevState.showAddProductDialog
				}
			})
		}
	}

	onCloseAddProductDialog(){
		this.setState({
			showAddProductDialog:false,
		})
	}


	toggleNewsletterDialog(){
		this.setState(prevState =>{
			return{
				showNewsletterDialog: !prevState.showNewsletterDialog
			}
		})
	}

	onCloseNewsletterDialog(){
		this.setState({
			showNewsletterDialog:false,
		})
	}

	clearCart (){
		//console.log("Clearing Cart")
		this.setState({
			cart: [],
			cartAmount: 0
		})
	}

	handleCloseSnackbar(){
        const { cookies } = this.props
        this.setState({
            hasAcceptedCookie: true,
        })
        cookies.set('user_firstVisit', { path: '/' })
    }

    hasMounted = () =>{
    	this.setState({
    		hasMounted: true
    	})
    }


	render(){
/*		console.log("isDataFetched",this.state.isDataFetched)
		console.log("cartAmount",this.state.cartAmount)
		console.log("activeProduct RENDER", this.state.activeProduct)
		console.log("this.props.location.pathname",this.props.location.pathname)
		const { cookies } = this.props
		console.log("products", this.state.products)
		console.log("cookies", cookies)
		console.log("cart",this.state.cart)
		*/

    	return (
		    <Suspense fallback={<LoadIndicatorWithDelay/>}>

				<Header
		    		isHamburgerOpen={this.state.isHamburgerOpen}
		    		toggleMenu={this.toggleMenu}
		    		cartAmount={this.state.cartAmount}
		    		hasProducts={this.state.hasProducts}
		    	/>
		    	<Switch>
				    <Route exact path="/">
				    	<div className="loadingBackdropDiv">
		    				<Backdrop open={this.state.isDataFetched === false && this.state.hasMounted}>
		        				<CircularProgress color="primary" />
		      				</Backdrop>
		      			</div>
				        <Home
				        	addToCart={this.addToCart}
				        	cartAmount={this.state.cartAmount}
				        	products={this.state.products}
				        	activeProduct={this.state.activeProduct}
				        	treesPlanted={this.state.treesPlanted}
				        	hasProducts={this.state.hasProducts}
				        	onCloseAddProductDialog={this.onCloseAddProductDialog}
				    		toggleAddProductDialog={this.toggleAddProductDialog}
				    		showAddProductDialog={this.state.showAddProductDialog}
				    		startDate={this.state.startDate}
							countdownTimeMs={this.state.countdownTimeMs}
							hasMounted={this.hasMounted}
							isDataFetched={this.state.isDataFetched}
				        />
				    </Route>
				    <Route path="/Confirmation">
				    	<Confirmation userId={this.state.userId} clearCart={this.clearCart}/>
				    </Route>
				    <Route path="/ConfirmationMb" render={(props) => <ConfirmationMb {...props} clearCart={this.clearCart} />} />
				    <Route path="/TermsAndConditions" component={TermsAndConditions} />
				    <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
				    <Route path="/AboutUs" component={AboutUs} />
				    <Route path="/ProductList">
				    	<ProductList
				    		products={this.state.products}
				    	/>
				    </Route>
				    <Route path="/FAQs" component={FAQs} />
					<Route path="/Cart">
				    	<Cart
				    		cart={this.state.cart}
				    		onChangeCartItemAmount={this.onChangeCartItemAmount}
				    		deleteCartItem={this.deleteCartItem}
				    		cartAmount={this.state.cartAmount}
				    		activeProduct={this.state.activeProduct}
				    		addToCart={this.addToCart}
				    		userId={this.state.userId}
				    		deliveryCost={this.state.deliveryCost}
				    	/>
				    </Route>
					<Route path="/Payment">
					   	<Payment userId={this.state.userId} activeProduct={this.state.activeProduct} hasStock={this.state.hasStock}/>
					</Route>
					<Route path="*">
			            <NotFound />
			        </Route>
				</Switch>
				{
				this.props.location.pathname !=='/Cart' && 
				this.props.location.pathname !=='/Payment' &&
				this.props.location.pathname !=='/Confirmation' &&
				this.props.location.pathname !=='/ConfirmationMb' &&
				this.state.isDataFetched &&

					<React.Fragment>
			    		<Footer showDialog={this.state.showNewsletterDialog} toggleNewsletterDialog={this.toggleNewsletterDialog} onCloseNewsletterDialog={this.onCloseNewsletterDialog}/>
						<MessengerCustomerChat
							pageId="101000871726496"
							appId="688646268684219"
							language="pt_PT"
							greetingDialogDisplay="show"
						/>
					</React.Fragment>
		    	}
		    	<CookieSnackbar handleClose={this.handleCloseSnackbar} acceptedCookie={this.state.hasAcceptedCookie}/>

    		</Suspense>
    	)
	}
}

export default compose(withRouter, withCookies)(App)
