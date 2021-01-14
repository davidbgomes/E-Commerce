import React from 'react'
import "./styles/ProductList.css"
import ProductListCard from "./components/ProductListCard"
import {Helmet} from 'react-helmet'
import { isMobile } from "react-device-detect"

function ProductList(props){
	return(
		<div className="container productListDiv">
			<Helmet>
	    		<title>Oxyllus - Lista de Produtos</title>
    			<meta name="description" content="Confira todos os produtos vendidos na nossa loja, os seus detalhes, e quando ajudaram à nossa causa." />
    		</Helmet>
			<h1 className="text-center">Produtos</h1>
			<p className="text-center productListDescription">{`${isMobile ? "Toque" : "Clique"} nos produtos para conferir os detalhes`}</p>
			<div className="row mt-lg-5 mt-3">
				{Object.keys(props.products).map((item, i) => (
					<div className="col-md-4" key={i}>
						<ProductListCard
							image={props.products[item].data.ImageUrl}
							id={props.products[item].data.Id}
							title={props.products[item].data.Name}
							description={props.products[item].data.IsActive ? "Em curso" : "Concluído"}
							soldProducts={props.products[item].data.InitialStock - props.products[item].data.CurrentStock}
							campaignStartDate={props.products[item].data.CampaignStartDate}
							campaignEndDate={props.products[item].data.CampaignEndDate}
							beneficiary={props.products[item].data.Beneficiary}
							country={props.products[item].data.Country}
							isActive={props.products[item].data.IsActive}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default ProductList