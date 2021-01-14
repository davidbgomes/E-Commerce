import React from "react"
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import "../styles/DialogComponent.css"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"

function DialogComponent(props){
	return(
		<Dialog onClose={props.onClose} aria-labelledby="simple-dialog-title" open={props.showDialog}>
			<div className="dialogTitleDiv">
				<CheckCircleIcon className="dialogCheckIcon"/>
				<DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
			</div>
			<DialogActions>
				<Button
					variant="contained"
					className="DialogLeaveButton"
					onClick={props.onClose}
	        	>
	        		Sair
	        	</Button>

	        	<Link to="/Cart">
					<Button
						variant="contained"
	        			color="primary"
	        			startIcon={<ShoppingCartOutlinedIcon />}
	        			onClick={props.onClose}
	        		>
	        			Carrinho
	        		</Button>
	        	</Link>
        	</DialogActions>
		</Dialog>
	)
}

export default DialogComponent