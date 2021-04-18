import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Likes from "./Likes.js";
import GetValidToken from 'auth/GetValidToken';
import GetAuthHeader from 'auth/GetAuthHeader';

import axios from "axios";

export default function PodcastLike({numLikes, setNumLikes,  userLiked, setUserLiked, podcast_pk}){
    const [error, setError] = useState("")
    const podcast_like_url = localStorage.getItem("__APIROOT_URL__").concat('userfeatures/podcast_like')


    const onClick = (e)=> {
        e.preventDefault()
        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: podcast_like_url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
                },
                data:{
                    'podcast_pk':podcast_pk
                }
            }).then((response)=>{
                setUserLiked(!userLiked)
                if(!userLiked){
                    setNumLikes(numLikes +1)              
                }else{
                    setNumLikes(numLikes -1)
                }
            }).catch((error)=>{
                if(error.response && error.response.data){
                   setError(error.response.data.detail) 
                }else{
                    setError("Something went wrong :(")
                }
                
            })

        }).catch((msg)=>{ // Validation error
            setError(msg)
        })
    }

    return (
            <>
            {error != "" 
                ? <Alert severity="error">Please login to like this</Alert>
                : null
            }
            <form onSubmit={(e)=> e.preventDefault()}>
                <Likes numLikes={numLikes} userLiked={userLiked} onClick={onClick} />
            </form>
            </>
        )
}