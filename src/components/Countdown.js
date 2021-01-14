import React, { useState } from 'react'
import CountdownPackage from 'react-countdown';
import "../styles/Countdown.css"
import { CircularProgressbar , buildStyles } from 'react-circular-progressbar';

function Countdown(props){

	const [date] = useState(Date.now() - (Math.abs(Date.now() - new Date(props.startDate).getTime())) + props.time)

	const Completionist = () => <span style={{fontSize:"20px"}} className="text-center">O produto irá aparecer dentro de instantes...</span>;

	// Renderer callback with condition
	const renderer =({ days, hours, minutes, seconds, completed }) => {
	  if (completed) {
	    	// Render a completed state
	    	return <Completionist />
	  } else {
		    // Render a countdown
		    return (
		    	<React.Fragment>
		    		{!completed &&
		    			<h2 className="text-center mb-4 mb-md-5">Próximo Produto em:</h2>
		    		}
			    	<div className="countdownDiv">
		    			<div className="timeDiv mr-2 mr-lg-5">
		    				<CircularProgressbar value={days} minValue={0} maxValue={30} text={`${days}`} strokeWidth={5} styles={
		    					buildStyles({pathColor: 'white', textSize: '30px', trailColor: '#ffffff1c', textColor:'#5ca975'
		    				})}/>
		    				<span className="subtitle">Dias</span>
		    			</div>
		    			<div className="timeDiv mr-2 mr-lg-5">
		    				<CircularProgressbar value={hours}  minValue={0} maxValue={23} text={`${hours}`} strokeWidth={5} styles={
		    					buildStyles({pathColor: 'white', textSize: '30px', trailColor: '#ffffff1c', textColor:'#5ca975'
		    				})}/>
		    				<span className="subtitle">Horas</span>
		    			</div>
		    			<div className="timeDiv mr-2 mr-lg-5">
		    				<CircularProgressbar value={minutes}  minValue={0} maxValue={59} text={`${minutes}`} strokeWidth={5} styles={
		    					buildStyles({pathColor: 'white', textSize: '30px', trailColor: '#ffffff1c', textColor:'#5ca975'
		    				})}/>
		    				<span className="subtitle">Minutos</span>
		    			</div>
		    			<div className="timeDiv">
		    				<CircularProgressbar value={seconds}  minValue={0} maxValue={59} text={`${seconds}`} strokeWidth={5} styles={
		    					buildStyles({
		    						pathColor: 'white', textSize: '30px', trailColor: '#ffffff1c', textColor:'#5ca975'
		    				})}/>
		    				<span className="subtitle">Segundos</span>
		    			</div>
			    	</div>
			    </React.Fragment>
		    )
	  	}
	}

	return(
		<CountdownPackage
			date={date}
			renderer={renderer}
		/>
	)
}

export default Countdown

