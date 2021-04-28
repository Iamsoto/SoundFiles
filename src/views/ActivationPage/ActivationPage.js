import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert';
import GetValidToken from "auth/GetValidToken.js"
import GetAuthHeader from "auth/GetAuthHeader.js"
import Button from "components/CustomButtons/Button.js"
import Box from '@material-ui/core/Box';
import { useParams, Redirect } from "react-router-dom"
import axios from "axios"

export default function ActivationPage({}){
    const {code} = useParams();
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [seeResend, setSeeResend] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const verify_url = localStorage.getItem("__APIROOT_URL__").concat(`users/activate/${code}`)
    const resend_url = localStorage.getItem("__APIROOT_URL__").concat('users/resend')
    useEffect(()=>{
        GetValidToken().then(response=>{
            axios({
                method:"get",
                url:verify_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                }
            }).then(response =>{
                setSuccess("Successfully verfieid email! Thank you!")
                setSeeResend(false)
            }).catch(error =>{
                if(error.response.status === 429){
                    setError("Calm down on the activation!")
                    setSeeResend(false)                      
                }

                else if(error.response && error.response.data && error.response.data.detail){
                    if (error.response.data.detail == "user already verified"){
                        setRedirect(true)
                    }
                }

                else{
                    setError("Something happened here. Try again later or resend the verification email")
                    setSeeResend(true)                    
                }


            })
        }).catch(msg=>{
            setError("Please try logging in to validate your email")
        })
    },[])


    const reSendLink = (e) =>{
        e.preventDefault()
        GetValidToken().then(response=>{
            axios({
                method:"post",
                url:resend_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                },
                data:{}
            }).then(response=>{
                setError(false)
                setSuccess("Sent another validation email!")
                setSeeResend(false)

            }).catch(error=>{
                setError("Something went wrong. Please try again later")
                setSeeResend(false)

            })
        }).catch(msg=>{
            setError("Please try logging in to validate your email")
        })

    }

    if(redirect){
        return (<Redirect to="/" />)
    }

    return (
        <>
            <Box m={15} />
            {error != "" ? <Alert severity="error">{error}</Alert>:null}
            {seeResend ? <Button onClick={reSendLink} color="white">Resend Verification Email</Button> : null}
            {success != "" ? <Alert severity="info">{success}</Alert> :null}
        </>
    )
}
