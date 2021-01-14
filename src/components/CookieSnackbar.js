import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import { Link } from "react-router-dom"
import "../styles/Snackbar.css"

function CookieSnackbar(props){

	const TermsAndConditions = <Link key={"TermsAndConditions"} to="/TermsAndConditions">Termos e Condições</Link>
	const PrivacyPolicy = <Link key={"PrivacyPolicy"} to="/PrivacyPolicy">Política de Privacidade</Link>
	return(
		<Snackbar
	        anchorOrigin={{
	        	vertical: 'bottom',
	        	horizontal: 'left',
	        }}
	        open={!props.acceptedCookie}
	        onClose={props.handleClose}
	        message={["Ao utilizar o nosso site, concorda com os nossos ",TermsAndConditions, " e a ", PrivacyPolicy]}
	        action={
          		<React.Fragment>
	            	<Button size="large" style={{color:"deepskyblue"}} onClick={props.handleClose}>
	              		Aceitar
	            	</Button>
          		</React.Fragment>
        	}
      	/>
	)
}

export default CookieSnackbar