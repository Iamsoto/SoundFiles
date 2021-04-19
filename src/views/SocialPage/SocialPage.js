import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';

import ECnotification from 'views/SocialPage/ECNotification.js';
import Profile from 'components/Profile/Profile.js';

import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";

import { Redirect } from "react-router-dom";

import axios from 'axios'
import 'assets/css/Notifications.css'

export default function SocialPage(){
    const [error, setError] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [ECNotifications, setECNotifications] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)

    const episode_comment_notifications_get = localStorage.getItem("__APIROOT_URL__").concat('userfeatures/episode_comment_notifications')

    useEffect(()=>{
        GetValidToken().then(()=>{
            axios({
                method:'get',
                url: episode_comment_notifications_get.concat(`?page=${page}`),
                headers: {
                  'Content-Type':'application/json',
                  'Accept':'*/*',
                  'Authorization': GetAuthHeader()
                }
            }).then((response) => {
                if(response.data && response.data.results){
                    setError("")
                    setECNotifications(response.data.results)
                    setTotalPages(response.data.total_pages)
                }else{
                    setError("Something went wrong. Please try again later")
                }
            }).catch(error => {
                setError("Something bad happened. Please try again later")
            })
    }).catch(msg =>{
        // Authentication error
        setRedirect(true) 
    })
    },[page])

    if(redirect) {
        return (<Redirect to="/"/>); 
    }

    const changePage = (e, i) => {
        e.preventDefault()
        setPage(i)
    }

    return(
        <Grid container>
            {error != "" ?<Grid item xs={12}><Alert severity ="error">{error}</Alert></Grid>:null}
            <Grid item xs={12} md={7}>
                <div className="notifications-title-main">
                    Notifications
                </div>
                {ECNotifications.map((notification)=>(
                    <React.Fragment key={`episode-comment-notification-${notification.pk}`}>
                        <ECnotification notification={notification} />
                    </React.Fragment>
                ))}

                    {totalPages > 1?
                    <Pagination count={totalPages} page={page} onChange={changePage}/>
                    : null
                    }
            </Grid>

            <Grid item xs={12} md ={5}>
                <div className="notifications-wrapper">
                    <Profile/>
                </div>
            </Grid>


        </Grid>

        )
}