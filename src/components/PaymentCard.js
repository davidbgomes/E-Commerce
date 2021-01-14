import React from "react"
import "../styles/PaymentCard.css"
import check from "../images/check.png"

function PaymentCard(props){

	return(
		<div className="container">

			{props.name === props.checkedType ?
			<div className="card paymentCardChecked" onClick={() => props.handleClick(props.name)}>
				<div className="checkIcon">
					<img alt="check" src={check} className="checkIcon"/>
				</div>
				<img alt="credit" src={props.imgUrl} className={`card-img-top ${props.name}Image`}/>
				{props.text !== "" &&
					<span>{props.text}</span>
				}	
			</div>
			:
			<div className="card paymentCard" onClick={() => props.handleClick(props.name)}>
				<img alt="credit" src={props.imgUrl} className={`card-img-top ${props.name}Image`}/>
				{props.text !== "" &&
					<span>{props.text}</span>
				}
			</div>
			}

		</div>
	)
}

export default PaymentCard