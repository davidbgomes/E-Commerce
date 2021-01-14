import React, { useState } from 'react'

import "../styles/ProductListCard.css"
import Button from '@material-ui/core/Button'
import { useSpring, animated as a } from 'react-spring'
import moment from 'moment'

import firebase from '../config/FirebaseConfig'

function ProductListCard(props){

	const [hasImageLoaded, setHasImageLoaded] = useState(false)

	const [flipped, set] = useState(false)

	const { transform, opacity } = useSpring({
    	opacity: flipped ? 1 : 0,
    	transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    	config: { mass: 5, tension: 500, friction: 80 }
  	})


	const imageLoaded = () =>{
		setHasImageLoaded(true)
	}

	const downloadFile = (Id) =>{

		const storageRef = firebase.storage().ref()

        storageRef.child(`/Products/${Id}/comprovativo.pdf`).getDownloadURL().then( async url => {
        	//console.log("url", url)
        	window.open(url)
        	//FileSaver.saveAs(url, "Comprovativo.pdf")
        })
        .catch(function(error) {
		  console.log(error)
		})
	}

	return(
		<a.div className="card productListCard c">
			<div onClick={() => set(state => !state)}>
				<a.div className="c front"  style={{ opacity: opacity.interpolate(o => 1 - o), transform }}  >
					<img src={props.image} className="card-img-top" alt="test" onLoad={() => imageLoaded()}/>
					{hasImageLoaded &&
					<div className="card-body">
					 	<div className="row">
					 		<div className="col-12">
					 			<h3 className="card-title">{props.title}</h3>
					 		</div>
					 	</div>
					 	<p className="card-text">{props.description}</p>
					 </div>
					}
				</a.div>
				<a.div className="c back" style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}>
					<h4 className="text-center">{`Artigos vendidos: ${props.soldProducts}` }</h4>
					<h4 className="text-center">{`Data início: ${moment(props.campaignStartDate.toDate()).format("DD/MM/yyyy")}` }</h4>
					<h4 className="text-center">{`Data fim: ${props.campaignEndDate === "" ? "-" : moment(props.campaignEndDate.toDate()).format("DD/MM/yyyy")} `}</h4>
					<h4 className="text-center">{`Entidade: ${props.beneficiary}` }</h4>
					<h4 className="text-center">{`País: ${props.country}` }</h4>
				</a.div>
			</div>
			<a.div className="front downloadButtonDiv" style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`), display: flipped ? "initial" : "none" }}>
				<Button
		 			variant="contained"
		 			className="addToCartButton downloadButton mt-5"
		 			onClick={() => downloadFile(props.id)}
		 			disabled={props.isActive}
		 		>
		 			<span style={{color:"black"}}>
		 				Comprovativo
		 			</span>
		 		</Button>
			</a.div>
		</a.div>
	)
}

export default ProductListCard