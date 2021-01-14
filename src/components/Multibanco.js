import React from "react"
import "../styles/Multibanco.css"
import NumberFormat from 'react-number-format'

function Multibanco(props){
	return(
		<div className="card multibancoDiv">
			<div className="card-header multibancoHeader">
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Multibanco.svg/1200px-Multibanco.svg.png" alt="mb"/>
			</div>
			<div className="card-body multibancoDetailsDiv">
				<p><b>Entidade</b> : {props.entity}</p>
				<p><b>Referência</b> : <NumberFormat value={props.reference} displayType={'text'} format={'### ### ###'} /></p>
				<p><b>Valor</b> : {props.price} €</p>
			</div>
		</div>
	)
}

export default Multibanco