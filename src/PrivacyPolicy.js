import React, { useEffect } from 'react'
import "./styles/PrivacyPolicy.css"
import {Helmet} from 'react-helmet'

function PrivacyPolicy(){

	useEffect(() => {
		document.title = "Oxyllus - Política de Privacidade"

		// When page is rendered, always go to the top of the page
        window.scrollTo(0, 0)
  	})


	return(
		<div className="container privacyPolicyDiv">
			<Helmet>
	    		<title>Oxyllus - Política de Privacidade</title>
    			<meta name="description" content="Política de Privacidade" />
    		</Helmet>
			<h2 className="mt-3 mb-4 text-center"> Política de Privacidade </h2>

			<p>
				A sua privacidade é importante para nós. Respeitamos a sua privacidade em relação a qualquer informação sua que possamos recolher no site.
			</p>

			<p>
				Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
			</p>

			<p>
				Apenas retemos as informações recolhidas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
			</p>

			<p>
				Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
			</p>

			<p>
				Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
			</p>

			<p>
				O uso do nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Caso não concorde com os termos, não utilize o site.
			</p>

			<h3 className="mt-4"><u>Cookies</u></h3>
			<p>
				No nosso site, limitamos ao máximo o uso de cookies, e os que temos servem somente para melhorar a experiência dos utilizadores. Como tal, temos cookies de informam-nos da primeira visita, de forma a mostrar o aviso para as nossas 'Políticas de Privacidade' e 'Termos e Condições'.
			</p>


			<h3 className="mt-4"><u>Cookies de Terceiros</u></h3>
			<p>
				Também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.
			</p>
			<ul>
				<li>Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como você usa o site e como podemos melhorar a sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar a produzir conteúdo atraente.
				</li>
			</ul>

			<p> Para mais informações sobre cookies do Google Analytics, consulte a página oficial do Google Analytics <a href="https://policies.google.com/technologies/partner-sites?hl=pt-PT&gl=uk" target="_blank" rel="noopener noreferrer"> aqui </a> </p>

			<ul>
				<li> As análises de terceiros são usadas para rastrear e medir o uso deste site, para que possamos continuar a produzir conteúdo atrativo. Esses cookies podem rastrear itens como o tempo que você passa no site ou as páginas visitadas, o que nos ajuda a entender como podemos melhorar o site para você.
				</li>
				<li> Periodicamente, testamos novos recursos e fazemos alterações subtis na maneira como o site se apresenta. Quando ainda estamos a testar novos recursos, esses cookies podem ser usados ​​para garantir que você receba uma experiência consistente enquanto estiver no site, enquanto entendemos quais otimizações os nossos utilizadores mais apreciam.
				</li>
				<li> À medida que vendemos serviços, é importante entendermos as estatísticas sobre quantos visitantes de nosso site realmente compram e, portanto, esse é o tipo de dados que esses cookies rastrearão. Isso é importante para você, pois significa que podemos fazer previsões de negócios com precisão que nos permitem analizar nossos custos de publicidade e serviços para garantir o melhor preço possível.
				</li>
			</ul>

			<h3 className="mt-2"><u>Mais informação</u></h3>

			<p>Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza, contacte-nos para esclarecimentos em <a href="mailto:lusthub.pt@gmail.com" target="_blank" rel="noopener noreferrer"> oxyllus.store@gmail.com </a></p>
		</div>
	)
}

export default PrivacyPolicy