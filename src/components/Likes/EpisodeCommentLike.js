import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Likes from "./Likes.js";
import GetValidToken from 'auth/GetValidToken';
import GetAuthHeader from 'auth/GetAuthHeader';

import axios from "axios";

export default function EpisodeCommentLike({numLikes, setNumLikes, userLiked, setUserLiked, comment_pk}){
    const [error, setError] = useState("")
    const episode_comment_like_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comment_like`)
    

    const onClick = (e)=> {
        e.preventDefault()

        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: episode_comment_like_url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
                },
                data:{
                'comment_pk':comment_pk
                }
            }).then((response)=>{
                setUserLiked(!userLiked)
                if(!userLiked){
                    setNumLikes(numLikes +1)              
                }else{
                    setNumLikes(numLikes -1)
                }
            }).catch((error)=>{
                   
                if(error.response.status === 429 ){
                    setError("Calm down with the likes!") 
                }else{

                    setError("Something went wrong :(")
                }
                
                
            })

        }).catch((msg)=>{ // Validation error
            //console.log(msg)
            setError("Please login")
        })
    }

    return (
            <>
            {error != "" 
                ? <Alert severity="error">{error}</Alert>
                : null
            }
            <Likes numLikes={numLikes} userLiked={userLiked} onClick={onClick} />
            </>
        )
}