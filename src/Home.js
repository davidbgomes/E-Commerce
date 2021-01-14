import React from 'react'
import "./styles/Home.css"
import logo from "./images/logo.png"
import ProductCard from "./components/ProductCard"
import VisibilitySensor from "./components/VisibilitySensor"
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import DialogComponent from "./components/DialogComponent"
import Countdown from "./components/Countdown"
import CountUp from 'react-countup'
import {ReactComponent as TreeAnimation} from "./components/TreeAnimation.svg"
import {Helmet} from 'react-helmet'


class Home extends React.Component{
	constructor(){
		super()
		this.state={
			hasLogoLoaded:false,
			hasProductImageLoaded:false,
		}
		this.imageLoaded = this.imageLoaded.bind(this)
		this.hasImageLoaded = this.hasImageLoaded.bind(this)
	}

	componentDidMount(){
		this.props.hasMounted()
	}

	hasImageLoaded(){
		this.setState({
			hasProductImageLoaded:true
		})
	}

	imageLoaded(){
		this.setState({
			hasLogoLoaded:true,
		})
	}

	render(){

		return(
			<div className="container-fluid homeDiv" >
				<Helmet>
	    			<title>Oxyllus - Refloreste Connosco | Loja Online</title>
    				<meta name="description" content="Compre online os nossos produtos exclusivos. Por cada produto que comprar, 1 Árvore será plantada. Faça parte da Reflorestação!" />
    			</Helmet>

    			<div className="fb-customerchat" page_id="668619323999479">
				</div>

        		<img src={logo} className="img-fluid logoImage" onLoad={this.imageLoaded} alt="Oxyllus logo"/>
				
        		<div className="row mainRow">
					{this.props.hasProducts ?
						<div className="col-md-6 col-lg-8 firstSectionHomeDiv">
			    			<div className="productDiv" style={{display: this.state.hasProductImageLoaded === false && "none"}}>
					    		<div>
				    				<ProductCard
				    					image={this.props.activeProduct.data.ImageUrl}
				    					title={this.props.activeProduct.data.Name}
				    					description={this.props.activeProduct.data.Description}
				    					price={this.props.activeProduct.data.Price}
				    					addToCart={this.props.addToCart}
				    					toggleDialog={this.props.toggleAddProductDialog}
				    					homeList={true}
				    					cartAmount={this.props.cartAmount}
				    					currentStock={this.props.activeProduct.data.CurrentStock}
				    					hasImageLoaded={this.hasImageLoaded}
				    				/>
						    		<DialogComponent
						    			title="Produto adicionado com sucesso!"
						    			showDialog={this.props.showAddProductDialog}
						    			onClose={this.props.onCloseAddProductDialog}
						    			toggleDialog={this.props.toggleAddProductDialog}
						    		/>
					    		</div>
				    		</div>
				    	</div>
			    	:
				    	<div className="col-md-6 col-lg-8 mt-4 firstSectionHomeDiv countdownDiv">
				    		{this.props.startDate !== null && this.props.countdownTimeMs !== 0 &&
								<React.Fragment>
									<Countdown startDate={this.props.startDate} time={this.props.countdownTimeMs} />
								</React.Fragment>
					    	}
				    	</div>
			    	}
			    	<div className="col-md-6 col-lg-4">
		    			<div className="row text-center statsDiv">
		    				{this.props.hasProducts &&
		    				<VisibilitySensor delayedCall={true} partialVisibility={true}>
            					{({ isVisible }) => {
            						const stock = isVisible ? this.props.activeProduct.data.CurrentStock : 0
            						return(
				    					<div style={{opacity:isVisible ? 1 : 0, display: this.state.hasProductImageLoaded === false && "none"}} className="circularProgressDiv">
						    				<CircularProgressbar
						    					value={stock}
						    					minValue={0}
						    					maxValue={this.props.activeProduct.data.InitialStock}
						    					text={`${this.props.activeProduct.data.CurrentStock}`} strokeWidth={5}
						    				/>
						    				<span>Produtos Restantes</span>
						    			</div>
            						)
								}}
							</VisibilitySensor>
							}
							{this.state.hasLogoLoaded && (this.state.hasProductImageLoaded || this.props.hasProducts === false) &&
								<VisibilitySensor delayedCall={true} partialVisibility={true}>
									{({ isVisible }) => {
										return(
			            					<div className="mt-4 treeDiv" style={{display: this.props.isDataFetched === false && "none"}}>
				            				
				            					<TreeAnimation />
												<CountUp
								    				className="counterValues mt-4"
													start={0}
													end={this.props.treesPlanted}
													suffix=" Árvores Plantadas"
													duration={4}
												/>
				            				</div>
										)
									}}
								</VisibilitySensor>
							}
						</div>
					</div>
				</div>

			</div>
		)
	}
}
export default Home