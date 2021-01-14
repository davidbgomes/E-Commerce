import React from "react"
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel'
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isPostalCode from 'validator/lib/isPostalCode'

import "../styles/Wizard.css"


function Wizard(props) {

	const steps = props.getSteps()

	const handleNext = () => {

		let hasError = false
		if(props.activeStep === 0){
			if(props.firstName === ""){
				props.showFirstNameError()
				hasError = true
			}
			else if(props.lastName === ""){
				props.showLastNameError()
				hasError = true
			}
			else if(props.email === "" || !isEmail(props.email)){
				props.showEmailError()
				hasError = true
			}
			else if(props.phoneNumber === "" || !isMobilePhone(props.phoneNumber,'pt-PT')){
				props.showPhoneNumberError()
				hasError = true
			}
			else if(props.hasAcceptedTermsAndConditions === false){
				props.showAcceptedTermsAndConditionsError()
				hasError = true
			}
		}

		else if(props.activeStep === 1){
			
			if(props.address === ""){
				props.showAddressError()
				hasError = true
			}
			else if(props.city === ""){
				props.showCityError()
				hasError = true
			}

			else if(props.postalCode === "" || !isPostalCode(props.postalCode,'PT')){
				props.showPostalCodeError()
				hasError = true
			}

			else if(props.town === ""){
				props.showTownError()
				hasError = true
			}
			else if(props.billingAddress === ""){
				props.showBillingAddressError()
				hasError = true
			}
			else if(props.billingCity === ""){
				props.showBillingCityError()
				hasError = true
			}

			else if(props.billingPostalCode === "" || !isPostalCode(props.billingPostalCode,'PT')){
				props.showBillingPostalCodeError()
				hasError = true
			}

			else if(props.billingTown === ""){
				props.showBillingTownError()
				hasError = true
			}
		}

		else if(props.activeStep === 2){
			if(props.method === "mbw" && (props.mbWayPhoneNumber === "" || !isMobilePhone(props.mbWayPhoneNumber,'pt-PT'))){
				props.showMbWayPhoneNumberError()
				hasError = true
			}
		}

		if(hasError === false){
			props.handleNextStep()
		}
			//setActiveStep((prevActiveStep) => prevActiveStep + 1)
	}

	return (
		<div className="container wizardDiv">
			<Stepper activeStep={props.activeStep} alternativeLabel>
				{steps.map((label) => (
					<Step key={label}>
					<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				<div>
					<Typography component={'span'}>{props.getStepContent(props.activeStep)}</Typography>
					<div className="form mt-4">
						<button
							disabled={props.activeStep === 0}
							onClick={props.handleBackStep}
							className="btn btn-secondary"
						>
							Voltar
						</button>
						{props.activeStep !== steps.length - 1 ?
							<button disabled={(props.activeStep === 0 && props.hasErrorStep0) || (props.activeStep === 1 && props.hasErrorStep1)} className="btn btn-light continueButton" onClick={handleNext}>
								Continuar
							</button>
						:
							<button className="btn btn-light continueButton" onClick={props.submitPayment}>
								Confirmar
							</button>
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Wizard