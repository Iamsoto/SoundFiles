import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// core components
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Checkbox from '@material-ui/core/Checkbox';
import { LoginContext } from 'auth/LoginContext.js';
import styles from "assets/jss/material-kit-react/views/loginPage.js";

import { Redirect, useHistory } from "react-router-dom";
//import image from "assets/img/bg7.jpg";
import axios from "axios";


const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const default_errors= {
    username:"",
    email:"",
    password1:"",
    password2:"",
    terms:"",
  }
  let history = useHistory()
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [username, setUsername] = useState("");
  const [email, setEmail] =useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [newsLetter, setNewsLetter] = useState(true);
  const [terms, setTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const [frontErrors, setFrontErrors] = useState(default_errors);
  const [serverErrors, setServerErrors] = useState({});
  const [bigError, setBigError] = useState("");
  const [goHome, setGoHome] = useState("");

  const { loggedIn, setLoggedIn } = useContext(LoginContext); 

  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const submit_form_url = localStorage.getItem("__APIROOT_URL__") + 'users/create';


  const toTerms = (event) =>{
    alert("You did it!");
  }

  const submit = () =>{
    axios({
          method: 'post',
          url: submit_form_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          },
          data: JSON.stringify({
            'username': username,
            'email': email,
            'password1':password1,
            'password2':password2,
            'news_letter':newsLetter
        })
        }).then((response) =>{
            setSuccess(true);
        }).catch((error) =>{

          if(error.response && error.response.data){
            if(error.response.data !== undefined){
              setServerErrors(error.response.data);
            }
            else{
              setBigError("Something went wrong, please try again later")
            }            
          }else{
            console.log(error);
          }

        });
  }

  /*
    Final validation
  */
  const finalValidation = (event) => {
    event.preventDefault();


    let temp_errors = {...default_errors}

    if(password1 !== password2){
      temp_errors.password2 = "Passwords should match";
    }else if(password1 === ""){
      temp_errors.password1 = "Required";
    }

    if(username === ""){
      temp_errors.username = "required";
    }

    if(terms === false){
      temp_errors.terms = "Please accept the terms and conditions";
    }

    setFrontErrors(temp_errors);

    if(temp_errors.username === "" 
      && temp_errors.email === "" 
      && temp_errors.password1 ===""
      && temp_errors.password2 ===""
      && temp_errors.terms ===""
      ){
      submit();
    }

    return ()=> {setServerErrors({}); setBigError("")};
  }

  const setEmailWrapper = (e) =>{
    e.preventDefault()
    let temp_errors = {...frontErrors}
    temp_errors.email = ""
    let temp_email = e.target.value


    if(temp_email === ""){
      temp_errors.email = "Required";

    }else {
      let lastAtPos = temp_email.lastIndexOf('@');
      let lastDotPos = temp_email.lastIndexOf('.');
       
       if (!(lastAtPos < lastDotPos 
        && lastAtPos > 0 
        && temp_email.indexOf('@@') == -1 
        && lastDotPos > 2 
        && (temp_email.length - lastDotPos) > 2)) {
           temp_errors.email = "Invalid Email";
        }
    }
    
    setFrontErrors(temp_errors)
    

    setEmail(e.target.value);
  }

  const setUsernameWrapper = (e) => {
    e.preventDefault();
    let temp_errors = {...frontErrors}

    if(e.target.value.length < 5){
      temp_errors.username = "Please make your username > 5 characters";
      setFrontErrors(temp_errors);
    }else if(e.target.value.length > 18){
      temp_errors.username = "Please make your username < 19 characters :)";
      setFrontErrors(temp_errors);
    }else{
      if(frontErrors.username !== ""){
        temp_errors.username ="";
        setFrontErrors(temp_errors)        
      }
      
    }
    setUsername(e.target.value);                  
  }

  const setPassword2Wrapper = (e) =>{
    e.preventDefault()
    let temp_errors = {...frontErrors}

    if(e.target.value != password1){
      temp_errors.password2 = "Passwords must match!"
      setFrontErrors(temp_errors)
    }else{
      if(temp_errors.password2 !== ""){
        temp_errors.password2 = ""
        setFrontErrors(temp_errors)
        
      }
    }
    setPassword2(e.target.value)

  }

  useEffect(()=>{

    if(loggedIn){
      setGoHome(true)
    }

  },[loggedIn])

  if(goHome){
    return(<Redirect to="/" />);
  }

  if(success){
    history.push("/login")
    return(<></>)
  }

  return (
    <div>
        <div className={classes.container}> 
          {bigError !== "" ? <Alert severity="error">{bigError} </Alert> : null}
          <Grid container justify="center">
            <Grid item xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Signup For Free!</h4>
                  </CardHeader>
                  <CardBody>
                    {serverErrors.username !== undefined ? <div className={classes.labelRootError}> {serverErrors.username[0]}</div>: null}
                    {frontErrors.username !== "" ? <div className={classes.labelRootError}> {frontErrors.username} </div> : null}
                    <CustomInput
                      labelText="Username"
                      id="username"
                      onChange={setUsernameWrapper}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />

                    { serverErrors.email !== undefined ? <div className={classes.labelRootError}> {serverErrors.email[0]} </div> : null}
                    { frontErrors.email !== "" ? <div className={classes.labelRootError}> {frontErrors.email} </div> : null}

                    <CustomInput
                      labelText="Email..."
                      id="email"
                      onChange= {setEmailWrapper}
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

                    { frontErrors.password1 !== "" ? <div className={classes.labelRootError}> {frontErrors.password1} </div> : null }
                    <CustomInput
                      labelText="Password"
                      id="password1"
                      onChange={(e)=> {
                        e.preventDefault();
                        setPassword1(e.target.value);
                        }}
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

                    {frontErrors.password2 !== "" ? <div className={classes.labelRootError}>{frontErrors.password2}</div> :null}

                    <CustomInput
                      labelText="Password Again"
                      id="password2"
                      onChange={setPassword2Wrapper}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        autoComplete: "off"
                      }}
                    />

                    <FormControl className={classes.form}>
                      <FormGroup row= {true}>
                        <FormControlLabel 
                            value="News Letter" 
                            label={<div className={classes.labelRoot}>Sign up for the news letter!</div>}
                            labelPlacement="end"
                            control={<Checkbox
                            checked={newsLetter}
                            onChange={() => setNewsLetter(!newsLetter)}
                            color="primary"
                            />}>
                        </FormControlLabel>
                        
                        {frontErrors.terms !== "" ? <div className={classes.labelRootError}>{frontErrors.terms}</div> :null}

                        <FormControlLabel 
                            value="News Letter" 
                            label={<div className={classes.labelRoot}> <span>I accept the </span> <span style={{color:"blue"}} onClick={toTerms}>terms of use</span></div>}
                            labelPlacement="end"
                            control={<Checkbox
                            checked={terms}
                            onChange={() => setTerms(!terms)}
                            color="primary"
                            />}>
                        </FormControlLabel>

                      </FormGroup>
                    </FormControl>
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple type= "submit" color="primary" size="lg" onClick={finalValidation}>
                      Create Account
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
