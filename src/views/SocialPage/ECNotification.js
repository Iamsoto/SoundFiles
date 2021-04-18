import React, { useState } from 'react'
import { Link } from "react-router-dom";

import "assets/css/Notifications.css"
import axios from "axios";
import { useHistory } from "react-router-dom";

import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";

import Button from '@material-ui/core/Button';

export default function ECNotification({notification}){

    const ec_notifications_unseen_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/episode_comment_notifications_unseen");
    let history = useHistory();
    
    const getTitle = () =>{
        let episode_name = notification.episodeComment.episode != null ? notification.episodeComment.episode.name : notification.episodeComment.parent.episode.name
        if (notification.notify_type == "reply"){
            if (notification.count > 1) {
                return (`${notification.count} Replies to your comment on ${episode_name}`)
            }else{
                return (`${notification.count} Reply to your comment on ${episode_name}`)
            }
        }else if(notification.notify_type == "like"){
            if (notification.count > 1) {
                return (`${notification.count} Likes on your comment for ${episode_name}`)
            }else{
                return (`${notification.count} Like on your comment for ${episode_name}`)
            }            
        }
    }

    const APIPost = () => {
        GetValidToken().then(response =>{
            axios({
                method:'post',
                url:ec_notifications_unseen_url,
                headers: {
                  'Content-Type':'application/json',
                  'Accept':'*/*',
                  'Authorization': GetAuthHeader()
                },
                data:{
                    ecNotification_pk:notification.pk
                }
            }).then(response=>{
                // Do nothing


            }).catch(error=>{
                // Do nothing
                console.log(error.response.data)
            })

        }).catch(msg=>{
            // Authentication error

        })
    }

    const clickLink = (e) => {
        e.preventDefault()
        APIPost()
        console.log(notification.episodeComment.parent)
        let episode_comment_pk = notification.episodeComment.parent == null ? notification.episodeComment.pk : notification.episodeComment.parent.pk
        history.push(`/episode-comment/${episode_comment_pk}`)

    }

    return (
        <>
            <div className="notifications-box">
                <div className={notification.seen ? "notifications-title-seen" : "notifications-title-not-seen "}>
                  <Button color="inherit" style={{fontSize:"12px"}} onClick={clickLink}> {getTitle()}</Button>
                </div>

                <div className="notification-text">
                    {notification.episodeComment.text}
                </div>
        </div>
        </>
        )
}