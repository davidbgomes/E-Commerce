import React, { useState } from 'react'
import "../styles/CartItem.css"
import CloseIcon from '@material-ui/icons/Close'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { isMobile } from "react-device-detect"


function CartItem(props){

	const [count, setCount] = useState(props.quantity)

	const onChangeQuantity = (value) =>{
		if(value < 1){
			setCount(1)
		}
		else{
			setCount(value)
		}
	}

	const cartAmountValues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].filter(amount => {return amount <= props.currentStock})

	return(
		<div className="card mb-3 cartItemDiv">
		  	<div className="row no-gutters">
		    	<div className="col-3">
		      		<img src={props.image} className="card-img" alt="Product"/>
		    	</div>
		    	<div className="col-7 cartItemBody">
		      		<div className="card-body">
		        		<h2>{props.name}</h2>
		        		{ !isMobile &&
		        			<h4 className="card-text marginDescription">{props.description}</h4>
		        		}
		        		<h3 className="card-text marginPrice">{`${props.price}€`}</h3>
		      		</div>
		    	</div>
		    	<div className="col-2 card cartActions">
				 	<div className="deleteIconDiv">
				 		<button className="btn btn-link">
				 			<CloseIcon className="closeIcon" onClick={props.deleteCartItem}/>
				 		</button>
				 	</div>
		    		<div className="cartActionsQuantity">
				        <InputLabel id="amount">Qtd</InputLabel>
				        <Select
					        labelId="amount"
					        displayEmpty={true}
					        className="cartQuantitySelect"
					        id="amountValue"
					        value={count}
					        variant='outlined'
					        onChange={e => {props.onChangeCartItemAmount(e.target.value, props.name); onChangeQuantity(e.target.value)}}
				        >
				        	{
				        		cartAmountValues.map((item, i) =>{
				        			return(
				            			<MenuItem value={item} key={i}>{item}</MenuItem>
				        			)
				        		})
				            }
				        </Select>
				 	</div>
		    	</div>
		  	</div>
		</div>
	)
}

export default CartItem