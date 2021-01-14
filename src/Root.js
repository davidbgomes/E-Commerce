import React, { useState } from 'react';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import {IsDevProvider} from "./components/IsDevContext"
import Div100vh from 'react-div-100vh'
import {BrowserRouter as Router} from "react-router-dom"
 
function Root() {

	//Setting the isDev variable for the entire APP
	const [isDev] = useState(false)

	return (
    	<CookiesProvider>
	    	<Div100vh style={{minHeight: '100rvh'}}>
		    		<IsDevProvider value={isDev}>
		    			<Router>
  							<App />
  						</Router>
				    </IsDevProvider>
			</Div100vh>
		</CookiesProvider>	
  	)
}

export default Root