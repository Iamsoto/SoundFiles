import React, { useState } from 'react'
import { Link } from "react-router-dom";

import "assets/css/Notifications.css"
import axios from "axios";
import { useHistory } from "react-router-dom";

import Alert from '@material-ui/lab/Alert';
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

export default function ECNotification({notification, render, setRender}){

    const ec_notifications_unseen_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/episode_comment_notifications_unseen");
    let history = useHistory();
    const [error, setError] = useState("")

    const getEpisodeName = () => {
        return notification.episodeComment.episode != null ? notification.episodeComment.episode.name : notification.episodeComment.parent.episode.name
    }

    const getTitle = () =>{
        
        if (notification.notify_type == "reply"){

            if (notification.count > 1) {
                return (`${notification.count} Replies to your comment on ${getEpisodeName()}`)
            }else{
                return (`One Reply to your comment on ${getEpisodeName()}`)
            }
        }else if(notification.notify_type == "like"){
            if (notification.count > 1) {
                return (`${notification.count} Likes on your comment for ${getEpisodeName()}`)
            }else{
                return (`One Person Liked your comment on ${getEpisodeName()}`)
            }            
        }else if(notification.notify_type == "playlist-like"){
            if (notification.count > 1){
                return(`${notification.count} Likes on your playlist: ${notification.playlist.name}`)
            }else{
                return(`One Person Liked your playlist: ${notification.playlist.name}`)
            }
        }else if(notification.notify_type == "playlist-sub"){
            if (notification.count > 1){
                return(`${notification.count} People Subscribed to your playlist: ${notification.playlist.name}`)
            }else{
                return(`One person subscribed to your playlist: ${notification.playlist.name}`)
            }            
        }
    }

    const APIPost = () => {
        /**
            Mark notification as seen
        */
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
            })

        }).catch(msg=>{
            // Authentication error
        })
    }

    const APIDelete = () => {
        /*
            Delete the notification
        */
        GetValidToken().then(response =>{
            axios({
                method:'delete',
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
                setError("Something bad happened. Please try again later")
            })

        }).catch(msg=>{
            // Authentication error
            setError("Something bad happened. Please try again later")
        })
    }

    const clickLink = (e) => {
        e.preventDefault()
        APIPost()
        if(notification.notify_type == "playlist-like" || notification.notify_type=="playlist-sub"){
            let playlist_pk = notification.playlist.pk
            history.push(`/playlist/${playlist_pk}`)  
        }else{
            let episode_comment_pk = notification.episodeComment.parent == null ? notification.episodeComment.pk : notification.episodeComment.parent.pk
            history.push(`/episode-comment/${episode_comment_pk}`)            
        }
    }

    const clickDelete = (e) =>{
        e.preventDefault()
        APIDelete()
        setRender(!render)
    }

    return (
        <>
            {render}
            <div className="notifications-box">
                {error != ""? <Alert severity="error">{error}</Alert>: null}
                <div className={notification.seen ? "notifications-title-seen" : "notifications-title-not-seen "}>
                  <Button color="inherit" style={{fontSize:"12px"}} onClick={clickLink}> 
                    {getTitle()}
                  </Button>
                </div>


                {notification.episodeComment ? 
                    <div className="notification-text">
                        {notification.episodeComment.text}
                    </div>
                : null}
              <div className="notification-right">
                <IconButton onClick={clickDelete}> 
                    <DeleteForeverIcon/>
                </IconButton>
              </div>
            </div>
        </>
        )
}