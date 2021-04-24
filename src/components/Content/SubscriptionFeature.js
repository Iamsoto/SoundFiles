import React, { useState, useEffect } from 'react'
import Button from 'components/CustomButtons/Button.js';
import { useHistory } from 'react-router-dom';
import { convertDate } from 'utils/Utils.js';

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';

import "assets/css/Landing.css"
import axios from "axios";

export default function SubscriptionFeature( {title, author, pk, last_updated, type, sub_pk}){
    const [onMobile, setOnMobile] = useState(true)
    const sub_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/subscribe_unseen");
    let history = useHistory()

    const mobileSetter = () => {
      /* For this component, onMobile = tablet or not */
      if(window.innerWidth <= 800){
          if(!onMobile){
              setOnMobile(true)
          }
                      
      }else{
          if(onMobile){
              setOnMobile(false) 
          }
      }
    }

    useEffect(()=>{
    /**
        Hook to use on window inner width
    */
    mobileSetter()
    window.addEventListener('resize', mobileSetter );

    return () => window.removeEventListener('resize', mobileSetter);

    },[window.innerWidth])


    const seen = () =>{
        GetValidToken().then((response) => {
            axios({
                method: 'post',
                url: sub_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                },
                data:{
                    sub_pk:sub_pk
                }
            }).then(response => {
                console.log(response.data)
            }).catch(error=>{
                console.log(error.respose)                
            })
        }).catch(msg =>{
            
        })      
    }

    const go = (e) => {
        e.preventDefault()
        seen()
        if(type === "podcast"){
            history.push(`/podcast/${pk}`)
        }else if (type === "playlist"){
            history.push(`/playlist/${pk}`)
        }
    }


    return(
        <>      
        <div className={onMobile ? 'landing-feature-mobile-subscribe' : 'landing-feature-subscribe'}>
            <div className="landing-feature-row">
                <div className={ onMobile ? "landing-feature-title-mobile" : "landing-feature-title"}>
                  <>{type === "playlist" ? "Playlist-" : null}</> 
                  <> {title}</> 
                </div>

            </div>
            <div className="landing-feature-row">
                <div className={onMobile ? "landing-feature-text-mobile" : "landing-feature-text"}>
                    By: {author}
                </div>
            </div>
            <div className="landing-feature-row">
                <div className={onMobile ? "landing-feature-text-mobile" : "landing-feature-text"}>
                    Updated: {convertDate(last_updated)}
                </div>
            </div>
            <div className="landing-feature-row">
                <Button 
                    color="primary"
                    style={{width:"100%", height:"100%"}}
                    onClick={go}>Go
                </Button>
            </div>
        </div>
        </>
        )
}