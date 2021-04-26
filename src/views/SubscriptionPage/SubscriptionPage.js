import React, { useState, useEffect } from "react"
import Alert from '@material-ui/lab/Alert';

import SubscriptionCards from "components/Content/SubscriptionCards.js";
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import Button from "@material-ui/core/Button";

import axios from "axios";

import "assets/css/Landing.css"
export default function SubscriptionPage(){
    const subscription_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/subscription")
    const [error, setError] = useState("")
    const [loadAmount, setLoadAmount] = useState(7)
    const [seeMore, setSeeMore] = useState(true);
    const [rows, setRows] = useState([])

    useEffect(()=>{

        GetValidToken().then((response) => {
            axios({
                method: 'get',
                url: subscription_url.concat(`?num=${loadAmount}`),
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                }
            }).then(response => {
                if(response.data){
                    if(response.data.length < loadAmount){
                        setSeeMore(false)
                    }
                    setRows(response.data)
                    
                }
            }).catch(error=>{
                if(error.response.data && error.response.data.detail){
                    setError(error.response.data.detail)
                }else{
                    setError("Something bad happened here. Please try again later")
                }
                
            })
        }).catch(msg =>{
            setError("Please login again.")
        })
    },[loadAmount])


    const numPerRow = () =>{
        return 6 // I don't feel like mathing this out
    }


    const onSeeMore = (e) =>{
        e.preventDefault();
        setLoadAmount(loadAmount + numPerRow())
    }

    const getContents =()=> {
        if(error === '' && rows.length >0){
            return (
                <>
                    <SubscriptionCards
                        items={rows}
                        row_name="Subscriptions"
                        load_amount={loadAmount}/>
                    <div className ="landing-row">
                    {seeMore ? <p><Button style = {{background:"transparent", color:"#999", fontSize:"12px"}} 
                                    onClick={onSeeMore}>See More...</Button>
                                </p>: null}
                    </div>
                </>)
        
        } else if( error !=='') {
            return (<Alert severity="error"> {error} </Alert>)
        }

        else{
            return (<h3>No Subscriptions to display!</h3>)
        }
    }

    return (
        <>  
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title">Subscriptions</div>
            </div>                          
            { getContents() }
        </div>
        </>
    );
}