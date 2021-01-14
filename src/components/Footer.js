import React, { useState } from 'react'
import "../styles/Footer.css"
import { Link } from "react-router-dom"

import mbway from "../images/mbway.png"
import multibanco from "../images/mb.png"
import visa from "../images/visaIcon.png"
import mastercard from "../images/mastercardIcon.svg"
import americanExpress from "../images/americanExpress.png"

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TextField from '@material-ui/core/TextField'
import MailchimpSubscribe from "react-mailchimp-subscribe"

import oneTreePlanted from "../images/oneTreePlanted.png"

import NewsletterDialog from "./NewsletterDialog"


function Footer(props){

	const url = "https://gmail.us17.list-manage.com/subscribe/post?u=038e3d1a53a396385b8526334&amp;id=701d818485"

	const [newsletterEmail, setNewsletterEmail] = useState("")
	const [hasErrorEmail, setHasErrorEmail] = useState(false)

	const handleEmailChange = (event) =>{
		setNewsletterEmail(event.target.value)
		setHasErrorEmail(false)
	}

	return(
		<div className="footer">
			<div className="pt-3">
				
				<div className="pt-1 container-fluid">
					<div className="row paymentOptionRow pt-2">

						<div className="col-lg-3 mt-1 mt-lg-0">
							<p className="footerTitle">Informações</p>
							<hr className="smallHr"></hr>
							<div className="informationCol">
								<Link to="/TermsAndConditions" className="text-white"><span className="InformationItems">• Termos e Condições</span></Link>

								<Link to="/PrivacyPolicy" className="text-white"><span className="InformationItems">• Política de Privacidade</span></Link>
								<Link to="/FAQs" className="text-white"><span className="InformationItems">• FAQ's</span></Link>
							</div>
						</div>

						<div className="col-lg-3 mt-4 mt-lg-0">
							<p className="footerTitle">Métodos de Pagamento</p>
							<hr className="bigHr"></hr>
							<div className="paymentOptionCol">
								<div className="card mr-2">
									<img src={visa} className="footerPaymentOption visa" alt="Visa icon"/>
								</div>
								<div className="card mr-2">
									<img src={mastercard} className="footerPaymentOption mastercard" alt="Mastercard icon"/>
								</div>
								<div className="card mr-2 americanExpressDiv">
									<img src={americanExpress} className="footerPaymentOption americanExpress" alt="AmericanExpress icon"/>
								</div>
								<div className="card mr-2 mbCard">
									<img src={multibanco} className="footerPaymentOption multibanco" alt="Multibanco icon"/>
								</div>
								<div className="card mr-2">
									<img src={mbway} className="footerPaymentOption mbway" alt="MB-Way icon"/>
								</div>
							</div>
						</div>

						<div className="col-lg-3 mt-3 mt-lg-0 socialMediaCol">
							<p className="footerTitle">Redes Sociais</p>
							<hr className="smallHr"></hr>
							<div className="socialMediaDiv">
								<div className="mr-2">
									<a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/oxyllus/">
										<FacebookIcon fontSize="large" className="facebookIcon" />
									</a>
								</div>
								<div className="mr-2">
									<a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/oxyllus/">
										<InstagramIcon fontSize="large" className="instagramIcon" />
									</a>
								</div>
							</div>
						</div>

						<div className="col-lg-3 mt-3 mt-lg-0 socialMediaCol">
							<p className="footerTitle">Newsletter</p>
							<hr className="smallHr"></hr>
							<MailchimpSubscribe
							    url={url}
							    render={({ subscribe, status, message }) => (
							     	<div>
										<div className="newsletterDiv">
											<TextField
									        	id="outlined-basic"
									        	value={newsletterEmail}
									        	onChange={handleEmailChange}
									        	error={hasErrorEmail}
									        	label="Email"
									        	variant="outlined"
									        />
									        <button className="ml-2 btn btn-light subscribeButton" onClick={() => {subscribe({EMAIL:newsletterEmail});props.toggleNewsletterDialog()}}>
									        	<span className="subscribeButtonText">Subscrever</span>
									        </button>
										</div>
								        <NewsletterDialog title="Subscrição da Newsletter" status={status} message={message} showDialog={props.showDialog} onClose={props.onCloseNewsletterDialog}/>
							      	</div>
							    )}
							  />
							
						</div>
					</div>
					<div className="row paymentOptionRow pt-2">
						<div className="col mt-4 mt-lg-0">
							<img src={oneTreePlanted} height="120" width="120" alt="one tree planted badge"/>
						</div>
					</div>
				</div>
				<div className="pt-5">
					<span style={{fontSize:"14px"}}> 2020 Oxyllus ® - Todos os direitos reservados</span>
				</div>
			</div>				
		</div>
	)
}

export default Footer