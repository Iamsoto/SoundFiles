import React, { useEffect, useContext } from 'react'

import { LoginContext } from "auth/LoginContext.js";
import { Redirect } from 'react-router-dom';

import 'assets/css/GoodbyePage.css';
export default function GoodbyePage(){

	const {loggedIn, setLoggedIn} = useContext(LoginContext)
	
	if(loggedIn==true){
		return (<Redirect to ="/"/>)
	}

	return(
		<div className="goodbye-main">
			<h6>Sorry to see you go. Come back anytime!</h6>
		</div>
		)

}