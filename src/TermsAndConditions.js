import React, { useEffect } from 'react'
import "./styles/TermsAndConditions.css"
import {Helmet} from 'react-helmet'

function TermsAndConditions(){

	useEffect(() => {
		document.title = "Oxyllus - Termos e Condições"

		// When page is rendered, always go to the top of the page
        window.scrollTo(0, 0)
  	})


	return(
		<div className="container termsAndConditionsDiv">
			<Helmet>
	    		<title>Oxyllus - Termos e Condições</title>
    			<meta name="description" content="Termos e Condições." />
    		</Helmet>

			<h2 className="mt-3 mb-4 text-center"> Termos e Condições </h2>

			<p>
				O utilizador do oxyllus.pt deve ler esta informação atentamente. Ao utilizá-lo, está implicitamente a concordar com os termos e condições abaixo discriminados. Caso não concorde com os termos e condições em vigôr, não deverá prosseguir com a utilização do mesmo. Sempre que houver a menção a "site", refere-se a oxyllus.pt.
				As fotografias dos produtos podem não ser uma representação exacta do equipamento. Por favor verifique sempre a descrição do produto, em caso de dúvidas sobre as características do produto contacte a loja.
			</p>

{/*			<h3 className="mt-4"><u>Prazos de entrega</u></h3>

			<p>
				Assim que for feita a encomenda, 
			</p>*/}

			<h3 className="mt-4"><u>Stock limitado e funcionamento de pagamento</u></h3>

			<p>O conceito da nossa loja funciona à volta da venda de uma quantidade limitada de produtos orginais. Como tal, <u>não há reserva de produtos por estar no carrinho ou no checkout</u>. O pedido só é realizado assim que for feito o pagamento. Fazemos isto para não reter demasiados produtos do stock que podem não vir a ser comprados, prejudicando eventuais compradores futuros.
			</p>
			<p>
				O stock é atualizado em tempo real, podendo os utilizadores ver quantos produtos há em stock no momento. Caso o metodo de pagamento seja pelo MB-Way ou pelo cartão Visa ou Mastercard, o pagamento é imediato assim que confirmado. Caso seja por Multibanco depende de quando for feito o pagamento e o processamento do lado da EasyPay.
			</p>


			<h3 className="mt-4"><u>Trocas ou devoluções por não satisfação</u></h3>

			<p>A oxyllus.pt reconhece a todos os seus Clientes o direito de livre resolução dos contratos celebrados à distância consignado Decreto-Lei n.º 24/2014, de 14 de Fevereiro, permitindo-lhes a devolução dos produtos adquiridos nos termos constantes de tal Diploma.
			Este direito é aplicável aos casos de encomendas enviadas à cobrança ou pré-pagas e enviadas por transportadora para o domicílio do Cliente.
			<u>As trocas ou devoluções de produto por não satisfação devem ser comunicadas à oxyllus.pt no prazo máximo legal de 14 dias úteis.</u> O Cliente deverá mencionar o número da encomenda ou da factura, tal como os motivos da troca ou devolução.
			Estão excluídos deste direito, designadamente, os seguintes casos:
			</p>
			<ul>
				<li>Produtos com vestígios de utilização ou danificados;</li>
				<li>Em todos os casos de exercício do direito de livre resolução, a devolução dos bens e os custos inerentes são da responsabilidade do Cliente;</li>
				<li>A quaisquer devoluções de dinheiros pagos será sempre deduzido o valor de portes de envio quando incluído no preço do bem fornecido.</li>
			</ul>

			<h3 className="mt-4"><u>Cancelamento de encomenda</u></h3>

			<p>
			O Cliente pode sempre cancelar ou alterar a sua encomenda bastando que nos contacte logo que possível para o email oxyllus.store@gmail.com e desde que a mesma ainda não tenha sido expedida.
			</p>


			<h3 className="mt-4"><u>Recepção de encomenda/artigo danificado no transporte</u></h3>
			<p>
				Ao receber a encomenda o Cliente deve sempre começar por a inspeccionar exteriormente a embalagem verificando se existem quaisquer danos.

				Se a embalagem apresentar danos exteriores graves, poderá recusar a encomenda sem a abrir. Caso contrário, deverá abrir a embalagem e, na presença do estafeta, confirmar a integridade dos produtos. Eventuais anomalias deverão ser mencionadas no próprio acto de confirmação da recepção da encomenda e imediatamente comunicadas, por escrito ou telefone, à oxyllus.pt que accionará o seguro de imediato.

				É condição fundamental para aceitação da reclamação que o cliente coloque reservas e/ou mencione os danos no acto de confirmação de recepção da mercadoria.

				Após confirmação do problema, a oxyllus.pt compromete-se a efectuar a troca sem custos adicionais para o cliente. As devoluções de artigos trocados deverá ser na sua embalagem de origem, e nas mesmas condições em que o recebeu.

				Recepção de encomenda/artigo trocado ou em falta:

				Se verificou a falta ou troca de um artigo da sua encomenda, contacte-nos no prazo de 24h após recepção da encomenda. Após confirmação do erro, a oxyllus.pt compromete-se a efectuar a troca sem custos adicionais para o cliente. As devoluções de artigos trocados deverá ser na sua embalagem de origem, e nas mesmas condições em que o recebeu.
			</p>

			<h3 className="mt-4"><u>Direitos Autorais</u></h3>
			<p>
				Todo o contéudo deste site, a menos que seja claramente explicitado em contrário, é da propriedade e diretos autorais de oxyllus.pt. Caso suspeite de alguma violação dos termos e condições deste site, por favor contacte-nos.
			</p>

			<h3 className="mt-4"><u>Alteração dos termos e Condições</u></h3>
			<p>
				Os termos e condições neste site podem ser alterados a qualquer altura sem aviso prévio. Como tal, aconselhamos aos utilizadores que revisem os mesmos periodicamente.
			</p>

		</div>
	)
}

export default TermsAndConditions