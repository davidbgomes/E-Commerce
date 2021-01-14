import React from "react"
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
import "../styles/PaymentAccordion.css"
import NumberFormat from 'react-number-format'

function PaymentAccordion(props){

	return(
		<div className="cartMobileTableDiv">
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<span className="finalPriceSpan"><ShoppingCartOutlinedIcon/> Preço final</span>
					<span className="finalPriceSpan ml-auto">
						<NumberFormat
		      				value={props.price}
		      				displayType={'text'}
		      				decimalSeparator=","
		      				suffix={'€'}
		      				decimalScale={2}
		      				fixedDecimalScale={props.price % 1 !== 0}
		      			/>
					</span>
				</AccordionSummary>
				<AccordionDetails>
					<span>
						{`${props.cart[0].quantity}x ${props.cart[0].name}`}
					</span>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}

export default PaymentAccordion