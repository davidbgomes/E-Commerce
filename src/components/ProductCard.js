import React, { useState} from 'react'

import "../styles/ProductCard.css"
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function ProductCard(props){

	const [count, setCount] = useState(1)
	const [hasImageLoaded, setHasImageLoaded] = useState(false)

	const onChangeQuantity = (value) =>{
		if(value <= 0){
			setCount(1)
		}
		else{
			setCount(value)
		}
	}

	const imageLoaded = () =>{
		setHasImageLoaded(true)
		props.hasImageLoaded()
	}

	const resetSelection = () =>{
		setCount(1)
	}

	let cartAmountValues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].filter(amount => {return amount <= props.currentStock - props.cartAmount})

	//console.log("count", count)
	return(
		<div className="card productCard mb-4">
			<img src={props.image} className="card-img-top" alt="test" onLoad={() => imageLoaded()}/>
			{hasImageLoaded &&
				<React.Fragment>
					<div className="card-body">
					 	<div className="row">
					 		<div className="col-8">
					 			<h3 className="card-title">{props.title}</h3>
					 		</div>
					 		{props.homeList &&
					 		<div className="col-4">
					 			<h3 className="text-right">{`${props.price} €`}</h3>
					 		</div>
					 		}
					 	</div>

					 	<p className="card-text productDescription">{props.description}</p>
					 	<div className="addToCartDiv">
					 		<InputLabel id="amount">Qtd</InputLabel>
					 		<Select
					 			labelId="amount"
					 			type="number"
					 			value={count}
					 			onChange={(event) => onChangeQuantity(event.target.value)}
					 			label="Qtd"
					 			variant="outlined"
					 		>
					 		{
				        		cartAmountValues.map((item, i) =>{
			        				return(
			            				<MenuItem value={item} key={i}>{item}</MenuItem>
			        				)
				        			
				        		})
				            }
						    </Select>

					 		<button
					 			className="btn btn-light addToCartButton"
					 			onClick={(event) => {props.addToCart(props.title,props.price,count,props.description,props.image); props.toggleDialog(); resetSelection()}}
					 			disabled={props.cartAmount >= 15 || props.cartAmount === props.currentStock}
					 		>
					 			<span className="buttonText">
					 				Adicionar ao Carrinho
					 			</span>
					 		</button>
					 		
					 	</div>
					</div>
				</React.Fragment>
			}
		</div>
	)
}

export default ProductCard