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

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  let history = useHistory()
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [serverError, setServerError] = useState("");
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

  const goLogin = () => {
    Login(email, password).then((response) =>{
      /**
        Successfully logged into the server
      */
      Logout(() => {}, () => {}); // Clean up left behinds
      SetLocalStorage(response);

      if(props.successFunc){
        props.successFunc()
      }

      setLoggedIn(true);

      if(!props.redirectURL){
        history.goBack()
      }else{
        setRedirect(true);
      }     
      
    }).catch((error) => {

      if(error.response !== undefined && error.response.data !== undefined){
        if(error.response.data.detail !== undefined){
          setServerError(error.response.data.detail);
        }else{
          setServerError("There was a problem logging in")
        }
      }else{
        setServerError("There was a problem logging in...")
      }
    })
  }

  if(redirect) {
    /**
      TODO: Ideally this should redirect to
        last page in history
    */
    return <Redirect to={props.redirectURL}/>
  }

  return (
    <div>
        <div className={classes.container}>
         { serverError !== "" ? <Alert severity="error">{serverError}</Alert> : null}
          <Grid container justify="center">
            <Grid item xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Login</h4>
                    <div className={classes.socialLine}/>
                  </CardHeader>
                  
                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      onChange={(event) => { event.preventDefault(); setEmail(event.target.value)}}
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
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      onChange={(event) => {event.preventDefault(); setPassword(event.target.value)}}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                    />
                    Need an account?<Link to="/register"> <span style={{color:"#3e248f"}}>Register Here!</span></Link>
                  </CardBody>


                  <CardFooter className={classes.cardFooter}>
                    <Button simple onClick={goLogin} color="primary" size="lg">
                      Login
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
