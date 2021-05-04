import React, { useState, useEffect, useContext } from "react"
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import SubscriptionCards from "components/Content/SubscriptionCards.js";
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import Button from "components/CustomButtons/Button.js";
import { Redirect } from 'react-router-dom';
import { LoginContext } from 'auth/LoginContext.js';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
                <div className="landing-title-small"> Password: ****** </div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Subscribed to News Letter: </div>
                        <FormControl>
                           <FormControlLabel
                              value="Add To" 
                              label="Subscribed"
                              labelPlacement="end"
                              style={{paddingLeft:"10px"}}
                              control={
                                <Checkbox 
                                  checked={true}
                                  color="primary"/>}
                                  value={"hello"}
                                />
                        </FormControl>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Membership Status: 
                <p>Right now, SoundFiles.fm is 100% free. However, there will be premium features in the near future, available through a monthly subscription. <br/>
                    If you enjoy this product and want to see it grow, please consider purchasing an early membership, this will
                    garuntee you access to future membership content, like unlimited playlists and subscriptions and more for just a one time payment!
                </p>
                <p>Also, please use the same email as on your soundfiles.fm account to make the payment!!</p>
                </div>

            <script src="https://gumroad.com/js/gumroad.js"></script>
                <a class="gumroad-button" href="https://gumroad.com/l/mbmGF?wanted=true" target="_blank" data-gumroad-single-product="true">
                    <Button color="primary">Purchase Early Membership</Button>
                </a>               
            </div>                         
        </div>
        
        </>
    );
}