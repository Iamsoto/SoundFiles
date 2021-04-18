import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Likes from "./Likes.js";
import GetValidToken from 'auth/GetValidToken';
import GetAuthHeader from 'auth/GetAuthHeader';

import axios from "axios";

export default function PlaylistLike({numLikes, setNumLikes,  userLiked, setUserLiked, episode_pk}){
    const [error, setError] = useState("")
    const episode_like_url = localStorage.getItem("__APIROOT_URL__").concat('userfeatures/episode_like')


    const onClick = (e)=> {
        e.preventDefault()
        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: episode_like_url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
                },
                data:{
                    'episode_pk':episode_pk
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