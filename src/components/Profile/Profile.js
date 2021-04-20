import React, { useEffect, useState } from 'react';

import Alert from '@material-ui/lab/Alert';
import GetValidToken from "auth/GetValidToken"
import  GetAuthHeader from "auth/GetAuthHeader.js";
import { useHistory } from "react-router-dom";

import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import 'assets/css/Notifications.css'

export default function Profile(){
    const [error, setError] = useState("")
    const profile_url =  localStorage.getItem("__APIROOT_URL__").concat('userfeatures/user_profile')
    const [score, setScore] = useState(0)
    const [playlists, setPlaylists] = useState([])
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    let history = useHistory()

    useEffect(()=>{
        GetValidToken().then(request=>{
            axios({
                method:'get',
                url: profile_url,
                headers: {
                  'Content-Type':'application/json',
                  'Accept':'*/*',
                  'Authorization': GetAuthHeader()
                }                
            }).then(response=>{
                if(response.data){
                    setScore(response.data.score)
                    setPlaylists(response.data.playlists)
                    setUsername(response.data.username)
                    setEmail(response.data.email)
                }else{  
                    setError("Something went wrong. Please try again later")
                }

            }).catch(msg =>{
                setError("Something went wrong. Please try again later")
            })
        }).catch(msg=>{
            // Authentication error
            setError("Something went wrong. Please try again later...")
        })

    },[])

    const goPlaylist = (e, playlist_pk) => {
        e.preventDefault()
        history.push(`/playlist/${playlist_pk}`)

    }

    return(
        <>
            <div className="notifications-row">
                {error != ""
                    ?<Alert severity="error">{error}</Alert>
                    : null
                }
            </div>

            <div className="notifications-row">
                <div className="notifications-title-main">{username}</div>
            </div>           

            <div className="notifications-row">
                <div className="notifications-title-main">Score: </div>
            </div>

            <div className="notifications-score">
                {score}
            </div>

            <div className="notifications-row">
                <div className="notification-score">Public Playlists: </div>
            </div>

            {playlists.map(playlist => (
                <React.Fragment key={`profile-playlist-${playlist.pk}`}>
                    <div className="notifications-row">
                        <Button color="inherit" style={{fontSize:"12px"}} onClick={(e)=>goPlaylist(e, playlist.pk)}>
                            <PlaylistPlayIcon/>{playlist.name}
                        </Button>
                    </div>
                </React.Fragment>
                )
            )}

        </>
        )
}