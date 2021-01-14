import React from "react"

import "./styles/Confirmation.css"

import IsDevContext from "./components/IsDevContext"

import { withRouter, Redirect } from 'react-router-dom'

import { withCookies } from 'react-cookie'
import { compose } from 'recompose'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import ReactGA from 'react-ga'

import CircularProgress from '@material-ui/core/CircularProgress'

import firebase from 'firebase/app'

import PropTypes from "prop-types"

import MailchimpSubscribe from "react-mailchimp-subscribe"

import axios from 'axios'

import {Helmet} from 'react-helmet'


class Confirmation extends React.Component{

	constructor(){
		super()
		this.state={
			userId: "",
			status:"",
			isLoading:true,
			hasError: false,

			name: "",
			surname: "",
			email:"",
			hasAcceptedNewsletterSubscription:false,

			redirect:null,

		}
		this.simulateClick = this.simulateClick.bind(this)

	}

	static contextType = IsDevContext;

	static propTypes = {
        location: PropTypes.object.isRequired,
    }

	async componentDidMount(){

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
		    		hasError: true,
		    		isLoading: false
		    	})
		  	}
		})

		const query = new URLSearchParams(window.location.search)

	    if (query.get("success")) {

	    	//console.log("inside success")

	    	let apiUrl = ''

	    	// Development
			if(this.context === true){
				apiUrl = 'http://localhost:5001/oxyllus-prd-96f49/us-central1/getConfirmationData'
			}
			// Production
			else{
				apiUrl = 'https://us-central1-oxyllus-prd-96f49.cloudfunctions.net/getConfirmationData'
			}

			//console.log("userId", this.state.userId)

	    	await axios.post(apiUrl, {
	    		userId: this.state.userId
	    	})
	    	.then(response => {

	    		ReactGA.initialize('UA-176389305-1');
				ReactGA.event({
					category: 'User',
					action: 'Bought a Product'
				})

				ReactGA.event({
					category: 'Purchase',
					action: 'Bought a Product'
				})

	    		const { cookies } = this.props
				cookies.remove('user_cart')

	    		this.setState({
	    			name: response.data.name,
					surname: response.data.surname,
					email: response.data.email,
					hasAcceptedNewsletterSubscription: response.data.hasAcceptedNewsletterSubscription,
					status: "ok",
					isLoading: false,
					redirect:false,
	    		},() => this.props.clearCart())

	    		//console.log("response.data", response.data)

	    	})
	    	.catch(error => {
	    		this.setState({
					status: "err",
					hasError: true,
					isLoading: false
	    		})
			    //console.log(error)
			})

	    }
	    else if (query.get("canceled")) {
	    	this.setState({
	    		status:"err",
	    		hasError:true,
	    		isLoading: false,
	    		redirect:false,
	    	})
	    }
	    else{
	    	this.setState({
	    		redirect:true
	    	})
	    }
	}


	simulateClick(e){
		if(e !== null && e !== undefined){
			e.click()
		}
	}

	render(){

		const url = "https://gmail.us17.list-manage.com/subscribe/post?u=038e3d1a53a396385b8526334&amp;id=701d818485"

		return(
			<React.Fragment>
				<Helmet>
		    		<title>Oxyllus - Confirmação de Pagamento</title>
	    		</Helmet>

	    		{this.state.redirect === false ?

	    			<React.Fragment>

						{ this.state.isLoading ?
							<div className="container">
								<div className="elementsDiv">
									<CircularProgress size="1"/>
									<h4 className="ProcessingInfo text-center">A processar o pagamento...</h4>
								</div>
							</div>
						:

							<div className="container">
								{ this.state.status === 'ok' && this.state.hasError === false ?
								<div className="card confirmationCard mt-5 border-success">
									<FontAwesomeIcon className="successIcon fa-9x" icon={faCheck} />

									<div className="card-body">
										<h2 className="cardTitle text-center">Pagamento efetuado com sucesso!</h2>
										<br></br>
										<p className="text-center"> Obrigado por comprar connosco, juntos podemos fazer a diferença!</p>
										<p className="text-center"> Enviámos para o seu Email os detalhes da encomenda.</p>
										<p className="text-center"> Esperamos por si no próximo Produto!</p>
									</div>
									{this.state.hasAcceptedNewsletterSubscription &&
										<MailchimpSubscribe
										    url={url}
										    render={({ subscribe, status, message }) => (
										    	<div>
										    		<div style={{display:"hidden"}} ref={this.simulateClick} onClick={() => subscribe({NAME:this.state.name, EMAIL:this.state.email})}> </div>
												</div>
										    )}
										/>
									}
								</div>
								:
								<div className="card confirmationCard mt-5">
									<FontAwesomeIcon className="errorIcon fa-9x" icon={faTimes} />

									{ this.state.authorizationKey !== undefined ?
									<div className="card-body">
										<h2 className="cardTitle text-center">Erro no processamento do Pagamento</h2>
										<p className="text-center"> Por favor tente novamente.</p>
									</div>
									:
									<div className="card-body">
										<h2 className="cardTitle text-center">Pagamento Cancelado</h2>
									</div>
									}
								</div>
								}
							</div>
						}
					</React.Fragment>
				:
					<Redirect to="/NotFound" />
				}
			</React.Fragment>
		)
	}

}

export default compose(withRouter, withCookies)(Confirmation)