import React, { useEffect } from 'react'
import "../styles/NotFound.css"
import {Helmet} from 'react-helmet'
import notFoundImg from "../images/404.png"


function NotFound(){

	useEffect(() => {

		// When page is rendered, always go to the top of the page
        window.scrollTo(0, 0)
  	})


	return(
		<div className="container notFoundDiv">
			<Helmet>
	    		<title>Oxyllus - Página não encontrada</title>
    		</Helmet>

    		<div className="card mt-4">
    			<img className="card-img-top" src={notFoundImg} alt="Not Found" />
    			<h2 className="card-title text-center">Erro 404 - Página não encontrada!</h2>
    			<h5 className="card-text text-center">Oops! Parece que a página que tentou aceder não existe</h5>
    			<h5 className="card-text text-center">Volte atrás ou retorne à pagina inicial.</h5>
    		</div>


		</div>
	)
}

export default NotFound