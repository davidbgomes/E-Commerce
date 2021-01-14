import React , { useState, useRef, useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import "../styles/LoadIndicatorWithDelay.css"

function LoadIndicatorWithDelay(){

	const delay = 100 // 200ms
	const [showLoadingIndicator, setLoadingIndicatorVisibility] = useState(true)
	const timerRef = useRef(null)

	useEffect(() => {
		let isMounted = true

		timerRef.current = setTimeout(() => {
			if (isMounted){
				setLoadingIndicatorVisibility(true)
			}
		}, delay)

		// this will clear Timeout when component unmount like in willComponentUnmount
		return () => {
            clearTimeout(timerRef)
            isMounted = false
        }
	})

	
	if(showLoadingIndicator){
		return(
			<div className="LoadIndicatorWithDelayDiv">
				<Backdrop open={true}>
					<CircularProgress color="primary" />
				</Backdrop>
			</div>
		)
	}
	else{
		return null
	}
}

export default LoadIndicatorWithDelay