import React, { useState, useEffect, useContext } from "react"
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import SubscriptionCards from "components/Content/SubscriptionCards.js";
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router-dom';
import { LoginContext } from 'auth/LoginContext.js';
import axios from "axios";

import "assets/css/Landing.css"
export default function SubscriptionPage(){
    const account_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/account")
    const [error, setError] = useState("")
    const [userObj, setUserObj] = useState([]);
    const [redirect, setRedirect] = useState("");
    const { loggedIn, setLoggedIn } = useContext(LoginContext);

    useEffect(()=>{

        GetValidToken().then((response) => {
            axios({
                method: 'get',
                url: account_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                }
            }).then(response => {
                if(response.data){
                    setUserObj(response.data)
                    
                }
            }).catch(error=>{
                if(error.response.data && error.response.data.detail){
                    setError(error.response.data.detail)
                }else{
                    setError("Something bad happened here. Please try again later")
                }
                
            })
        }).catch(msg =>{
            setRedirect(true)
            setError("Please login again.")
        })
    },[loggedIn])


    if(redirect){
        return(<Redirect to="/" />)
    }

    return (
        <>  
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title">Account Info</div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Username: </div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small"> Email: </div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small"> Email: </div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Subscribed to News Letter: </div>
            </div>                         
        </div>
        
        </>
    );
}