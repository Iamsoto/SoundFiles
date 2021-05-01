import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import Grid from '@material-ui/core/Grid';
import Login from "auth/Login.js";
import SetLocalStorage from "auth/SetLocalStorage.js"
import Logout from "auth/Logout.js";
import Alert from '@material-ui/lab/Alert';

// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Small from "components/Typography/Small.js"

import { LoginContext } from 'auth/LoginContext.js';

import { Redirect, Link, useHistory } from "react-router-dom";

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import "assets/css/Login.css";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  let history = useHistory()
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("")
  const [serverError, setServerError] = useState("");
  const [emailError, setEmailError] = useState("")
  const [error, setError] = useState("")
  const [redirect, setRedirect] = useState(false)
  
  const { loggedIn, setLoggedIn } = useContext(LoginContext); 

  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const classes = useStyles();
  const { ...rest } = props;

  useEffect(()=>{
    if(loggedIn){
      setRedirect(true);
    }
  },[loggedIn])

  const setEmailWrapper = (e) =>{
    e.preventDefault()
    let temp_email = e.target.value


    if(temp_email === ""){
      setEmailError("required");

    }else {
      let lastAtPos = temp_email.lastIndexOf('@');
      let lastDotPos = temp_email.lastIndexOf('.');
       
       if (!(lastAtPos < lastDotPos 
        && lastAtPos > 0 
        && temp_email.indexOf('@@') == -1 
        && lastDotPos > 2 
        && (temp_email.length - lastDotPos) > 2)) {
           setEmailError("invalid email")
        }else{
          setEmailError("")
        }
    }
    
    setEmail(e.target.value);
  }

  const requestNew = (e) => {
     e.preventDefault()
     if(emailError === ""){
      setError("")
      setSuccess("An email with information has been sent. Please check spam if you don't see it")
    }else{
      setError("Please correct the error(s) above")
    }
     
  }

  if(redirect) {

    return <Redirect to="/" />
  }

  return (
    <div>
        <div className={classes.container}>
         { serverError !== "" ? <Alert severity="error">{serverError}</Alert> : null}
         {success !== "" ? <Alert severity="info"> {success} </Alert> : null}
          <Grid container justify="center">
            <Grid item xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  
                  <CardHeader color="danger" className={classes.cardHeader}>
                    <h4>Forgot Password</h4>
                    <div className={classes.socialLine}/>
                  </CardHeader>

                  {emailError != null
                    ? <div className="login-error"> {emailError} </div>
                    : null
                  }

                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      onChange={setEmailWrapper}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>

                  <CardFooter className={classes.cardFooter}>
                    <Button simple onClick={requestNew} color="google" size="lg">
                      Request New Password
                    </Button>
                  </CardFooter>

                </form>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>

  );
}
