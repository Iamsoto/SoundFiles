import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";

import Alert from '@material-ui/lab/Alert';
import Card from "components/Card/Card.js";
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Info from "components/Typography/Info.js";
import CircularProgress from '@material-ui/core/CircularProgress';

import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import { LoginContext } from "auth/LoginContext.js";

import { useHistory } from "react-router-dom";
import axios from 'axios';

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from'auth/GetAuthHeader.js';
import styles from "assets/jss/RSSFormStyle.js";

const useStyles = makeStyles(styles);


export default function SecondaryForm(props) { 
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState('');
  const [soundHub, setSoundHub] = useState('')
  const [loading, setLoading] = useState(false);
  let history = useHistory()


  const submit_form_url = localStorage.getItem("__APIROOT_URL__") + 'podcasts/submit';

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    GetValidToken().then(()=>{
        axios({
          method: 'post',
          url: submit_form_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization': GetAuthHeader()
          },
          data: JSON.stringify({
            'rss_feed': props.url,
            'name': props.name,
            'image_url':props.image,
            'description':props.descr
        })
        }).then((response) => {
          /**
            On Success
          */
          var obj = response.data;
          if(obj.success){
            console.log(obj)
            localStorage.setItem("success", "Podcast Request submitted successfully. Please wait a few hours for updates");
            localStorage.setItem("seen", false);
            setSoundHub(obj.pk);
            history.push('/podcast/'.concat(obj.pk))
          }
        }).catch((error) => {
          // Server returned something > 4x
          if(error.response && error.response.data) {
              var obj = error.response.data;
              setErrorMsg(obj.detail);
            }else{
              setErrorMsg("Something went wrong. Please try again later.");
            }
            setLoading(false);
        })

    }).catch((msg) => {
      /**
        Authentication error
      */
      //setLoggedInWrapper(msg);
      setErrorMsg(msg);
      setLoading(false);
    }).finally(() => {

    });

  };

  return (
    <div className = {classes.devider}> 
      {errorMsg !== '' ? <Alert severity="error">{errorMsg}</Alert> : null }
      
     <form>       
        <Card>

          <CardHeader color="primary" className={classes.cardHeader}>
             <h2>{props.name}</h2>
          </CardHeader>

          <CardMedia
            className={classes.media}
            image={props.image}
            title=""
          />

          <CardContent>
            <Info>
              <p><a href = {props.url}>Author's RSS Feed</a></p> 
              <p>{props.descr}</p>
            </Info>
            
          </CardContent>

          <CardFooter className={classes.cardFooter}> 
              {loading ? <CircularProgress color="primary"/>     
               : <Button color="primary" size="lg" onClick={onSubmit}> Request this Podcast </Button>
              }
          </CardFooter>

        </Card>
      </form>
    </div>

  );
}