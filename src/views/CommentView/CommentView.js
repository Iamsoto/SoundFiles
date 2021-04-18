import React, { useEffect, useState } from 'react'
import { useParams } from "react-router";
import Alert from '@material-ui/lab/Alert';


import GetValidToken from "auth/GetValidToken.js"
import GetAuthHeader from "auth/GetAuthHeader.js"

import { Link, Redirect } from "react-router-dom";

import RootComment from 'components/Comments/EpisodeComments/RootComment.js'

import axios from "axios";

import 'assets/css/Comments.css'

export default function CommentView({}){
    const { pk } = useParams()
    const [comment, setComment] = useState({user:{}, post_date:0, time_stamp:0, text:"", pk:0, episode:{podcast:{}}})
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState("")

    const url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comment_detail/${pk}`)

useEffect(()=>{
        /**
            Get the comment
        */
        GetValidToken().then(()=>{
            /*
                Are we logged in? Do this!
            */
            axios({
            method: 'get',
            url: url,
            headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization': GetAuthHeader()
            }}).then((response) => {
                if(response.data && response.data.results && response.data.results.length > 0){
                    //Re-render the comments on submission
                    //console.log(response.data.results[0])
                    setComment(response.data.results[0])
                }else{
                    setRedirect(true)
                    }

            }).catch((error) =>{
                //console.log(error)
                if(error.response && error.response.data && error.response.data.detail){
                  setError(error.response.data.detail);
                }else {
                  setError("Something went wrong. Please try again later")
                }
            })

        }).catch(msg=>{
            //Authentication error, send an anonymous request
            axios({
                method: 'get',
                url: url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                }}).then((response) => {
                    if(response.data && response.data.results && response.data.results.length > 0){
                        setComment(response.data.result[0])
                    }else{
                        setRedirect(true)
                    }

                }).catch((error) =>{
                    if(error.response && error.response.data && error.response.data.detail){
                      setError(error.response.data.detail);
                    }else {
                      setError("Something went wrong. Please try again later")
                    }
                })
        })

    },[])
    
    if(redirect){

        return (<Redirect to ='/' />)
    }

    return (
        <>
            <div className="comment-main-title">Podcast: 
                
            </div>
            <div className = "comment-link">
                <Link style={{ textDecoration: 'none'  }} to={`/podcast/${comment.episode.podcast.pk}`}>{comment.episode.podcast.name}</Link>
            </div>            
            <div className="comment-main-title">Episode: 
                
            </div>
            <div className="comment-link">
                <Link style={{ textDecoration: 'none'  }} to={`/episode/${comment.episode.pk}`}>{comment.episode.name}</Link>
            </div>

            {error != "" 
                ?<Alert severity="error">{error}</Alert>
                : null
            }
            <RootComment 
                username={comment.user.username}
                postDate={comment.post_date}
                timeStamp={comment.time_stamp}
                text={comment.text}
                pk={comment.pk}
                num_likes={comment.num_likes}
                user_liked={comment.cur_user_liked}
                user_flagged={comment.cur_user_flagged}
            />
        </>
        )

}