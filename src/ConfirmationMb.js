import React, {useEffect} from 'react'
import Multibanco from "./components/Multibanco"
import MobilePay from './images/mobile_pay.png'
import "./styles/ConfirmationMb.css"
import {Helmet} from 'react-helmet'
import { useCookies } from 'react-cookie'
import { Redirect, Link } from "react-router-dom"
import Button from '@material-ui/core/Button';

import MailchimpSubscribe from "react-mailchimp-subscribe"

import ReactGA from 'react-ga'

function simulateClick(e){
	if(e !== null && e !== undefined){
		e.click()
	}
}

function ConfirmationMb(props){

	const [cookies, setCookie, removeCookie] = useCookies(['user_cart'])

	useEffect(() => {
		ReactGA.initialize('UA-176389305-1');
		ReactGA.event({
			category: 'User',
			action: 'Bought a Product'
		})

		removeCookie('user_cart')
		props.clearCart()
  	}, [])


	const url = "https://gmail.us17.list-manage.com/subscribe/post?u=038e3d1a53a396385b8526334&amp;id=701d818485"
	//console.log("location", props.location.state)
	//console.log("props.location.state.hasAcceptedNewsletterSubscription", props.location.state.hasAcceptedNewsletterSubscription)

	return(
		<div className="container">
			<Helmet>
	    		<title>Oxyllus - Confirmação de Pagamento</title>
    			{/*<meta name="description" content="Página de Confirmação de Pagamento." />*/}
    		</Helmet>

    		{props.location.state !== undefined ?

    			<React.Fragment>

		    		{props.location.state.hasAcceptedNewsletterSubscription &&
						<MailchimpSubscribe
						    url={url}
						    render={({ subscribe, status, message }) => (
						    	<div>
						    		<div style={{display:"hidden"}} ref={simulateClick} onClick={() => subscribe({NAME:props.location.state.name, EMAIL:props.location.state.email})}> </div>
								</div>
						    )}
						/>
					}
					{props.location.state.method === "mb" &&
						<div className="mt-3">
							<h2 className="text-center mt-3">Dados para efetuar o Pagamento</h2>
							<div className="bigMargin">
								<Multibanco entity={props.location.state.entity} reference={props.location.state.reference} price={props.location.state.price} />
								<h4 className="mt-5 text-center">Assim que o pagamento for recebido, receberá um email a confirmar a sua encomenda.</h4>
							</div>
							<div className="mt-5" style={{display:"table", marginLeft:"auto", marginRight:"auto"}}>
								<Link to="/">
									<Button color="primary" variant="contained">Voltar ao Início</Button>
							 	</Link>
							</div>
						</div>
					}
					{props.location.state.method === "mbw" &&
						<div>
							<div className="card mt-3">
								<h2 className="text-center text-dark mt-3">Confirme o Pagamento</h2>
								<div>
									<img src={MobilePay} className="mbwayPhoneIcon mt-4" alt="Phone to confirm payment"/>
									<h4 className="text-center text-dark mt-4"> O pedido de pagamento seguiu para o sua conta <b>MB-Way</b>.</h4>
									<h4 className="text-center text-dark mb-3">Assim que o pagamento for processado, enviaremos um email a confirmar a sua encomenda.</h4>
								</div>
							</div>
							<div className="mt-5" style={{display:"table", marginLeft:"auto", marginRight:"auto"}}>
								<Link to="/">
									<Button color="primary" variant="contained">Voltar ao Início</Button>
							 	</Link>
							</div>
						</div>
					}
				</React.Fragment>

			:
			<Redirect to="/NotFound" />
			}
		</div>
	)
}

export default ConfirmationMb