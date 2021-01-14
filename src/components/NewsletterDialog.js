import React from "react"
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import "../styles/DialogComponent.css"
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

function NewsletterDialog(props){
	return(
		<Dialog className="newsletterDialogDiv" onClose={props.onClose} aria-labelledby="simple-dialog-title" open={props.showDialog}>
			{props.status === "success" &&
				<React.Fragment>
					<div className="dialogTitleDiv">
						<CheckCircleIcon className="successIcon"/>
						<DialogTitle id="simple-dialog-title">Adicionado com sucesso!</DialogTitle>
					</div>
						<DialogContent>
				        	<DialogContentText id="alert-dialog-description">
				            	Obrigado por ter subscrito à nossa newsletter!
				          	</DialogContentText>
				        </DialogContent>
				</React.Fragment>
			}
			{props.status === "error" &&
				<React.Fragment>
					<div className="dialogTitleDiv">
						<ErrorOutlineIcon className="errorIcon" />
						<DialogTitle id="simple-dialog-title">Erro na Subscrição</DialogTitle>
					</div>
						{props.message.includes("is already subscribed to list Oxyllus")
						?
							<DialogContent>
				        		<DialogContentText id="alert-dialog-description">
				            		Este Email já foi adicionado à Newsletter.
				          		</DialogContentText>
				        	</DialogContent>
						:
							<DialogContent>
				        		<DialogContentText id="alert-dialog-description">
				            		Ocorreu um erro na tentativa de subscrição.
				            		Por favor, tente novamente.
				          		</DialogContentText>
				        	</DialogContent>
						}
				</React.Fragment>
			}
			{props.status === "sending" &&
				<div className="dialogTitleDiv">
					<CircularProgress size="1"/>
				</div>
			}
			<DialogActions>
				<Button
					variant="contained"
					className="DialogLeaveButton"
					onClick={props.onClose}
					disabled={props.status === "sending"}
	        	>
	        		Ok
	        	</Button>

        	</DialogActions>
		</Dialog>
	)
}

export default NewsletterDialog