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
import Badge from '@material-ui/core/Badge';
import axios from "axios";

import UpdatePassword from "views/AccountPage/UpdatePassword.js"
import "assets/css/Landing.css"

export default function SubscriptionPage(){
    const account_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/account")
    const news_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/news_letter")

    const [error, setError] = useState("");
    const [xpr, setXpr] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [newsLetter, setNewsLetter] = useState(false);
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [membership, setMembership] = useState(0)
    const [validEmail, setValidEmail] = useState(false)

    const [success, setSuccess] = useState("")

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
                    setNewsLetter(response.data.news_letter)
                    setUsername(response.data.username)
                    setEmail(response.data.email)
                    setValidEmail(response.data.valid_email)
                }
            }).catch(error=>{
                if(error.response && error.response.data && error.response.data.detail){
                    setError(error.response.data.detail)
                }else{
                    setError("Something happened. Please try again later")
                }
                
            })
        }).catch(msg =>{
            setRedirect(true)
            setError("Please login again.")
        })
    },[loggedIn])



    const changeNewsLetter = (e) => {
        e.preventDefault()

        GetValidToken().then((response) => {
            axios({
                method: 'post',
                url: news_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                },
                data:{

                },
            }).then(response=>{
                setNewsLetter(!newsLetter)
            }).catch(error=>{

            })
        }).catch(msg=>{

        })        
    }

    const clickChangePass = (e) =>{
        e.preventDefault()
        setXpr(true)
    }

    const close = (e) => {
        setSuccess("Successfully updated password!")
        setXpr(false)
    }

    const updatePass = (e) =>{
        e.preventDefault()

    }

    if(redirect){
        return(<Redirect to="/" />)
    }

    return (
        <>
        {error != "" ? <Alert severity = "error">{error}</Alert> : null}
        {success != "" ? <Alert severity="success"> {success} </Alert> : null}
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title">Account Info</div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Username: {username}</div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small"> Email: {email}</div>
                    <div className="landing-title-small"><p>Validated: {validEmail ? "Yes": "No"}</p></div>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small"> Password: ****** </div>
                {xpr
                    ?<UpdatePassword close={close}/>
                    : null                  
                }

                {!xpr
                    ? <Button color="rose" size="sm" onClick={clickChangePass}> Change Password </Button>
                    : null
                }

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
                                  checked={newsLetter}
                                  onChange={changeNewsLetter}
                                  color="primary"/>}
                                  value={newsLetter}
                                />
                        </FormControl>
            </div>                         
        </div>
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title-small">Membership Status: 
                    {membership > 0 
                        ? <Badge badgeContent={"Beautiful"} color="secondary"> Member</Badge> 
                        : <>Not a member yet</>
                    }
                </div>
                <div className="landing-account-sub ">
                <br />
                {membership === 0 ?
                <><p>Right now, SoundFiles.fm is 100% free. However, there will be premium features in the near future, available through a monthly subscription. <br/>
                    If you enjoy this product and want to see it grow, please consider purchasing an early membership, this will
                    garuntee you access to future membership content, like unlimited playlists and subscriptions. This early membership is available through a one time payment!
                </p>
                <p>**Please use the same email as on your soundfiles.fm account to make the payment!!</p>
                <p>**Updates to your membership status won't be reflected for at least a few hours. I need to manually update your status!</p>
                </>
                :<p>Thank you So much for supporting SoundFiles.fm!!!!!</p>}
                </div>

            <script src="https://gumroad.com/js/gumroad.js"></script>
                <a className="gumroad-button" href="https://gumroad.com/l/mbmGF?wanted=true" target="_blank" data-gumroad-single-product="true">
                    <Button color="primary">Purchase Early Membership</Button>
                </a>               
            </div>                         
        </div>
        
        </>
    );
}