import React, { useEffect} from 'react'
import "./styles/Cart.css"
import { Link } from "react-router-dom"
import CartItem from "./components/CartItem"
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import _ from "lodash"
import {Helmet} from 'react-helmet'
import NumberFormat from 'react-number-format'

function Cart(props){

	useEffect(() => {
		window.scrollTo(0, 0)
  	})

	var cartTotalPrice = 0
	Object.keys(props.cart).map((item, i) => (
		cartTotalPrice = cartTotalPrice + (props.cart[item].price * props.cart[item].quantity)
	))

	return(
		<div className="container-fluid cartDiv">
			<Helmet>
	    		<title>Oxyllus - Carrinho de Compras</title>
    			<meta name="description" content="Carrinho de Compras" />
    		</Helmet>
			{props.cartAmount > 0 ?
			<div className="row mt-4">
				<div className="col-lg-8">
					<h2 className="text-center">Carrinho de Compras</h2>
					<hr></hr>
					<div className="cartMainDiv">
						{Object.keys(props.cart).map((item, i) => (
							<CartItem
								name={props.cart[item].name}
								image={props.cart[item].imageUrl}
								description={props.cart[item].description}
								quantity={props.cart[item].quantity}
								onChangeCartItemAmount={props.onChangeCartItemAmount}
								deleteCartItem={props.deleteCartItem}
								price={props.cart[item].price}
								currentStock={props.activeProduct.data.CurrentStock}
							/>
						))}
					</div>
				</div>
				<div className="col-lg-4">
					<h2 className="text-center mt-5 mt-lg-1">Resumo</h2>
					<hr></hr>
					<table className="table table-dark cartTableDiv">
					  	<tbody>
					    	<tr>
						      	<td style={{width: "50%"}}>
						      		<span className="summaryItemText">
						      			{`Carrinho (${props.cartAmount})`}
						      		</span>
						      	</td>
						      	<td style={{textAlign: "center"}}>
						      		<span className="summaryItemText">
						      			<NumberFormat
						      				value={cartTotalPrice}
						      				displayType={'text'}
						      				decimalSeparator=","
						      				suffix={'€'}
						      				decimalScale={2}
						      				fixedDecimalScale={cartTotalPrice % 1 !== 0}
						      			/>
						      		</span>
						      	</td>
					    	</tr>
					    	<tr>
						      	<td>
							      	<span className="summaryItemText">
							      		Custos de entrega
							      	</span>
							    </td>
						      	<td style={{textAlign: "center"}}>
						      		<span className="summaryItemText">
						      			<NumberFormat
						      				value={props.deliveryCost}
						      				displayType={'text'}
						      				decimalSeparator=","
						      				suffix={'€'}
						      				decimalScale={2}
						      				fixedDecimalScale={props.deliveryCost % 1 !== 0}
						      			/>
						      		</span>
						      	</td>
					    	</tr>
					    	<tr>
						      	<td className="totalTd">
						      		<span style={{fontSize:"25px"}}>Total</span>
						      	</td>
						      	<td className="totalTd" style={{textAlign: "center"}}>
						      		<span className="totalText">
						      			<NumberFormat
						      				value={cartTotalPrice + props.deliveryCost}
						      				displayType={'text'}
						      				decimalSeparator=","
						      				suffix={'€'}
						      				decimalScale={2}
						      				fixedDecimalScale={(cartTotalPrice + props.deliveryCost) % 1 !== 0}
						      			/>
						      		</span>
						      	</td>
					    	</tr>
					  	</tbody>
					</table>
					<div className="card mb-3 cartShippingCard">
						<div className="row no-gutters">
			    			<div className="col-3">
			      				<LocalShippingIcon className="cartShippingIcon"/>
			      			</div>
				      		<div className="col-9">
					      		<div className="card-body">
					        		<h4 className="card-text">Entregas apenas para Portugal.</h4>
					        		<h4 className="card-text">Tempo estimado: 2-3 dias úteis</h4>
					      		</div>
					    	</div>
			      		</div>
			      	</div>
					<div style={{display:"table", marginLeft:"auto", marginRight:"auto"}}>
						<Link to={{
	        			pathname: "/Payment",
	        			state:{
	                        cart:props.cart,
	                        price:cartTotalPrice + props.deliveryCost,
	                        deliveryCost:props.deliveryCost,
	                        cartAmount:props.cartAmount,
	                        userId:props.userId
	                    }
	        			}}
	        			>
							<button
					 			className="btn btn-light mt-3 validateCartButton"
					 		>
					 			Validar Carrinho
					 		</button>
					 	</Link>
					</div>

				</div>
			</div>
			:
			<div className="card emptyCartCard">
				{! _.isEmpty(props.activeProduct) &&
				<React.Fragment>
			      	<SentimentVeryDissatisfiedIcon className="emptyCartIcon mt-2"/>
			      	<div className="card-body">
			      		<h3 className="text-center">O Carrinho de compras está vazio...</h3>
							<button
					 			className="btn btn-light mt-4"
					 			style={{display:"flex", marginLeft:"auto", marginRight:"auto"}}
					 			onClick={() => props.addToCart(props.activeProduct.data.Name, props.activeProduct.data.Price, 1, props.activeProduct.data.Description, props.activeProduct.data.ImageUrl)}
					 		>
					 			{`Adicionar 1 ${props.activeProduct.data.Name} ao carrinho`}
					 		</button>
			      	</div>
			    </React.Fragment>
		      	}
			</div>
			}
		</div>
	)
}

export default Cart