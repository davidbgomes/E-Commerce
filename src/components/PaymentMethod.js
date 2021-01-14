import React from "react"
import TextField from '@material-ui/core/TextField'

import mbway from "../images/mbway.png"
import multibanco from "../images/multibanco.png"
import visa from "../images/visa.png"


import PaymentCard from "./PaymentCard"

import "../styles/PaymentMethod.css"

function PaymentMethod(props){

	return(

		<div className="form mt-4">
			<h5 className="mt-4 mb-3">Selecione um método de pagamento:</h5>
		    <div className="row">
				<div className="col-xl mt-3">
					<PaymentCard imgUrl={visa} name="cc" checkedType={props.method} handleClick={props.handleMethodChange}/>
				</div>
				<div className="col-xl mt-3">
					<PaymentCard imgUrl={multibanco} name="mb" checkedType={props.method} handleClick={props.handleMethodChange}/>
				</div>
				<div className="col-xl mt-3">
					<PaymentCard imgUrl={mbway} name="mbw" checkedType={props.method} handleClick={props.handleMethodChange}/>
					{ props.method === "mbw" &&
				    <div className="form-group ml-2">
					    <div className="pt-4 form-group phoneField">
			          		<TextField error={props.hasErrorMbWayPhoneNumber} helperText={props.mbWayPhoneNumberErrorMessage} id="outlined-basic" defaultValue={props.mbWayPhoneNumber} type="tel" onChange={props.handleMbWayPhoneNumberChange} label="Nº telefone" variant="outlined" minLength="9" required/>
			          	</div>
					</div>
					}
				</div>
			</div>
		</div>
	)

}

export default PaymentMethod