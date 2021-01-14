import React, { useEffect } from 'react'
import "./styles/FAQs.css"
import {Helmet} from 'react-helmet'

function FAQs(){

	useEffect(() => {
		// When page is rendered, always go to the top of the page
        window.scrollTo(0, 0)
  	})


	return(
		<div className="container faqDiv">
			<Helmet>
	    		<title>Oxyllus - FAQ's | Perguntas Frequentes</title>
    			<meta name="description" content="Perguntas Frequentes." />
    		</Helmet>
			<h2 className="mt-3 mb-5 text-center">FAQ's - Perguntas Frequentes</h2>

			<h3><u>Só está um produto à venda?</u></h3>
			<p>
				Sim! Vendemos um produto de cada vez, e é edição limitada por isso não percas a oportunidade!
			</p>
			<p>
				Subscreve à nossa newsletter e segue-nos nas redes sociais para não perderes novidades sobre futuros lançamentos.
			</p>

			<h3 className="mt-4"><u>Posso cancelar a minha encomenda?</u></h3>
			<p>
				Pode, desde que a encomenda ainda não tenha sido expedida. Envie um email para oxyllus.store@gmail.com com o seu nome e número da encomenda para pedir o cancelamento e entraremos em contacto consigo.  
			</p>

			<h3 className="mt-4"><u>Quanto tempo demora o envio?</u></h3>
			<p>
				Em média demora cerca de 3 dias úteis. Este prazo é meramente indicativo, e para os Açores e Madeira o prazo pode ser alargado em função das limitações de transporte.
			</p>

			<h3 className="mt-4"><u>Que instituição será beneficiada com a minha compra?</u></h3>
			<p>
				Parte do montante da tua compra reverterá a 100% para a compra de 1 árvore e a sua plantação, e não o financiamento "cego" de uma instituição. Muitas das vezes não sabemos qual a utilização prática do nosso dinheiro quando doamos a instituições ou compramos algo em prol de benefício social ou neste caso ambiental, e queremos ser o mais transparentes possível nesse sentido.
				Temos instituições parceiras que são especializadas nesse trabalho e poderá ver qual a instituição que nos ajudou ou ajudará em cada lançamento na página Produtos.
			</p>

			<h3 className="mt-4"><u>Quando é que a minha árvore será plantada?</u></h3>
			<p>
				Quando todos os produtos forem vendidos, entraremos em contacto e coordenaremos com a instituição escolhida para fazer a plantação. Todos os compradores serão informados sobre o dia e local em que será feita, assim como fotos da sessão serão enviadas e partilhadas.
			</p>

			<h3 className="mt-4"><u>O número de árvores plantadas está atualizado?</u></h3>
			<p>
				Sempre que há uma compra, o contador é atualizado mostrando quantas árvores já foram plantadas mais as que serão plantadas, de forma a ter informação interativa e realista de como está a evoluir o lançamento do produto nesse âmbito.
				Ao invés de termos um contador para árvores já plantadas e por plantar, optámos por unificar essa informação.
			</p>


		</div>
	)
}

export default FAQs