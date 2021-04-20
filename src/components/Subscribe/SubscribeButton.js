import React, {useState, useEffect} from 'react'


import Button from 'components/CustomButtons/Button.js';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";

import "assets/css/PodcastStyle.css";

export default function SubscribeButton({userSubbed, setUserSubbed, numSubs, podcast_pk}){
    const [error, setError] = useState("");
    
    const subscribe_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/subscribe`);

    const Smashthatbutton = (e) =>{
        e.preventDefault()

        GetValidToken().then(()=>{
            axios({
                method:'post',
                url:subscribe_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization':GetAuthHeader(),
                },
                data: {
                    pk:podcast_pk,
                    type:'podcast'
                }
            }).then(response=>{
                setError("")
                setUserSubbed(!userSubbed)
            }).catch(error=>{
                setError("Something went wrong. Please try again later")
            })
        
        }).catch(msg => {
            setError("Please login to subscribe!")
        })

    }

    return(
       <> 
        <div className="podcast-row-slim">
            {error != "" ? <Alert severity="error">{error}</Alert>: null}
            <Button onClick={Smashthatbutton} color={userSubbed ? "primary": null} variant="contained">
                <>{userSubbed ? <>Subscribed</> : <>Subscribe!</>}</> 
            </Button>
            <div className="podcast-sub-count">
                {numSubs}
            </div>
        </div>
        </>
        )
}