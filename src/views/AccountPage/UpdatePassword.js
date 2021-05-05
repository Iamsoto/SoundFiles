import React, { useState } from 'react'
import axios from 'axios'
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import "assets/css/Landing.css"

export default function UpdatePassword({close}){
    const [password, setPassword] = useState("")
    const [newPass1, setNewPass1] = useState("")
    const [newPass2, setNewPass2] = useState("")    
    const [error, setError] = useState("")
    const change_pass_url = localStorage.getItem("__APIROOT_URL__").concat("users/change_password")
    
    const curPasswordChange = (e) =>{
        e.preventDefault()
        setPassword(e.target.value)
        
    }

    const submit = (e) => {
        GetValidToken().then((response) => {
            axios({
                method: 'post',
                url: change_pass_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                },
                data:{
                    current_pass:password,
                    new_pass_1:newPass1,
                    new_pass_2:newPass2
                }
            }).then(response => {
                if(response.data ){
                    setError("")
                    setPassword("")
                    setNewPass1("")
                    setNewPass2("")
                    close()
                }
            }).catch(error=>{
                if(error.response && error.response.data && error.response.data.detail){
                    setError(error.response.data.detail)
                }else{
                    setError("Something happened. Please try again later")
                }
                
            })          

        }).catch(msg => {

        })  
    }

    const newPassword1 = (e) =>{
        e.preventDefault()
        setNewPass1(e.target.value)
    }

    const newPassword2 = (e) => {
        e.preventDefault()
        setNewPass2(e.target.value)
    }

    return (
            <>
            {error!=""
                ?<Alert severity="error">{error}</Alert>
                :null
            }
            <CustomInput
              labelText="Current Password"
              id="account-pass-1"
              onChange={curPasswordChange}
              formControlProps={{
                fullWidth: false
              }}
              inputProps={{type:"password"}}
            />
            <br/>
            <CustomInput
              labelText="New Password"
              id="account-pass-2"
              onChange={newPassword1}
              formControlProps={{
                fullWidth: false
              }}
              inputProps={{type:"password"}}
            />
            <br/>
            <CustomInput
              labelText="Confirm New Password"
              id="account-pass-3"
              onChange={newPassword2}
              formControlProps={{
                fullWidth: false
              }}
              inputProps={{type:"password"}}
            />
            <br/>
            <Button color="facebook" size="sm" onClick={submit}> Update Password </Button>
            
            </>
        )
}