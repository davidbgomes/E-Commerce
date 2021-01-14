import React, { useEffect, useState } from 'react'
import "./styles/AboutUs.css"

import oneProductOneTree from './images/giftBox.svg'
import portugalFlag from './images/portugalFlag.png'

import followTreeProgress from './images/emailTree.png'
import {Helmet} from 'react-helmet'
import { isMobile } from "react-device-detect"

function AboutUs(){

	const [windowY, setWindowY] = useState(0)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
  	})

  	const handleScroll = () =>{
  		console.log(window.pageYOffset)
  		setWindowY(window.pageYOffset)
  	}

	//console.log("window.pageYOffset", window.pageYOffset)

	return(
		<div className="container aboutUsDiv">
			<Helmet>
	    		<title>Oxyllus - Sobre Nós</title>
    			<meta name="description" content="1 Compra = 1 Árvore. Saiba como tentamos tornar o mundo melhor, um produto de cada vez." />
    		</Helmet>
			<div>
				<h2 className="text-center mt-2">Se todos fizermos a nossa parte, deixamos o mundo um pouco melhor do que o encontrámos</h2>
				<div className="row mainRow">
					<div className="col-md-4 pr-0 colDiv informationCard1">
						<div className={`card border-primary ${(isMobile && windowY < 183) ? "selectedCard" : "infoCard"}`}>
							<div className="portugalflagDiv">
								<img src={oneProductOneTree} className="card-img-top portugalFlag" alt="Woman receiving gift within Nature"/>
							</div>	
							<div className="card-body">
								<h4 className="card-title text-center">1 Compra = 1 Árvore</h4>
								<hr></hr>
								<p className="card-text text-center">Por cada artigo que comprar na nossa loja, doamos uma árvore a organizações especializadas em reflorestação. Quanto mais comprar, mais árvores serão plantadas!</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 pr-0 colDiv informationCard2">
						<div className={`card border-primary ${(isMobile && windowY >= 183 && windowY < 459) ? "selectedCard" : "infoCard"}`}>
							<div className="portugalflagDiv">
								<img src={portugalFlag} className="card-img-top portugalFlag" alt="Portugal Flag"/>
							</div>
							<div className="card-body">
								<h4 className="card-title text-center">100% Português</h4>
								<hr></hr>
								<p className="card-text text-center">Damos valor ao que é Nacional. Todas as empresas com quem fazemos negócio são portuguesas.</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 pr-0 colDiv informationCard3">
						<div className={`card border-primary ${(isMobile && windowY >= 459) ? "selectedCard" : "infoCard"}`}>
							<img src={followTreeProgress} className="card-img-top" alt="Tree Postcard"/>
							<div className="card-body">
								<h4 className="card-title text-center">Acompanhe a sua Árvore</h4>
								<hr></hr>
								<p className="card-text text-center">A sua participação não acaba com a compra. Quando a plantação for feita, irá receber fotos da plantação que foi feita com a sua ajuda!</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	)
}

export default AboutUs