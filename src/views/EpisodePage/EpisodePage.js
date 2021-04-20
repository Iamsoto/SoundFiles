import React, { useState, useEffect, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AudioContext } from 'components/AudioPlayer/AudioContext.js'
import { AudioPlayerContext } from "components/AudioPlayer/AudioPlayerContext.js";
import { LoginContext } from "auth/LoginContext.js"
import Alert from '@material-ui/lab/Alert';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';

import EpisodeLike from 'components/Likes/EpisodeLike.js';
import PlaylistPopup from 'components/PlaylistPopup/PlaylistPopup.js';
import { convertSeconds } from "utils/Utils.js"
import GetValidToken from 'auth/GetValidToken';
import GetAuthHeader from 'auth/GetAuthHeader';
import Share from "components/Share/Share.js";
import CreateEpisodeComment from "components/Comments/EpisodeComments/CreateEpisodeComment.js";
import RootCommentList from "components/Comments/EpisodeComments/RootCommentList.js";
import Fuego from "components/Fuego/Fuego.js";
import Image from "views/EpisodePage/Image.js";

import axios from "axios";
import ShowMoreText from 'react-show-more-text';
import { useParams } from "react-router";
import { Redirect, useHistory } from "react-router-dom";


import "assets/css/EpisodePage.css";

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative",
    height:100,
  } 
}))

export default function EpisodePage(){
    const [onMobile, setOnMobile] = useState(false);
    const [episode, setEpisode] = useState({name:null, podcast:{}, description:null});
    const [rerenderComments, setRerenderComments] = useState(false);
    const [error, setError] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [redirectAddr, setRedirectAddr] = useState("");
    const [numLikes, setNumLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    let history = useHistory()
    const { pk } = useParams()
    const { setCurPlaylist, curPlaylist, trackIndex, setTrackIndex } = useContext(AudioPlayerContext)
    const { loggedIn, setLoggedIn } = useContext(LoginContext)

    const episode_url = localStorage.getItem("__APIROOT_URL__").concat(`podcasts/episode_detail/${pk}`)

    const mobileSetter = () => {
        if(window.innerWidth <= 360){
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
      var mounted = true
      if(mounted){
        
        //console.log(history.location.pathname)
        history.push(history.location.pathname)
      }
      return mounted = false  
    },[])

    useEffect(()=>{
     var mounted = true
     /**
        On mounted, call API
     */
     GetValidToken().then(()=>{
       axios({
            method: 'get',
            url: episode_url,
            headers: {
              'Content-Type':'application/json',
              'Accept':'*/*',
              'Authorization':GetAuthHeader()
            }
        }).then((response) => {
          if(response.data && mounted){
              setEpisode(response.data)
              setNumLikes(response.data.num_likes)
              setUserLiked(response.data.cur_user_liked)
          }

        }).catch((error) =>{
          if(error.response && error.response.data && error.response.data.detail && mounted){
            setError(error.response.data.detail);
          }else{
            setError("Something went wrong. Please try again later")
          }
        })   
     }).catch(msg=>{
      /* Authentication error, use regular request */
       axios({
            method: 'get',
            url: episode_url,
            headers: {
              'Content-Type':'application/json',
              'Accept':'*/*',
            }
        }).then((response) => {
          if(response.data && mounted){
              setEpisode(response.data)
              setNumLikes(response.data.num_likes)
              setUserLiked(response.data.cur_user_liked)
          }
        }).catch((error) =>{
          if(error.response && error.response.data && error.response.data.detail && mounted){
            setError(error.response.data.detail);
          }else{
            setError("Something went wrong. Please try again later")
          }
        })
     })


      return () => mounted=false;
    },[])


    useEffect(()=>{
        /**
            Hook to use on window inner width
        */
        mobileSetter()
        window.addEventListener('resize', mobileSetter );

        return () => window.removeEventListener('resize', mobileSetter);

    }, [window.innerWidth])


    useEffect(()=>{
    /**
      Hook used for checking if currently playing
    */
     var mounted = true;
      if(curPlaylist != null && curPlaylist[trackIndex] != null && curPlaylist[trackIndex].pk == pk){
          if(mounted){
              setPlaying(true);
              
          }
      }else{
          
          if(mounted){
              setPlaying(false);
          }
      }

     return () => mounted = false;
    },[curPlaylist, trackIndex])


    const clickMenu = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const goPodcast = (event) => {
        event.preventDefault()
        setRedirect(true);
        setRedirectAddr(`/podcast/${episode.podcast.pk}`)
    }

    const goLogin = (event) => {
      event.preventDefault()
      setRedirect(true);
      setRedirectAddr(`/login`);
    }

    if(redirect){
        if(episode.podcast != null){
            return <Redirect to={redirectAddr}/>
        }
    }

    const clickPlay = (e) => {
        e.preventDefault();
        if(playing){
            return;
        }else{  // play
            var playlistObj = {
                playlist_pk:null, 
                playlist_name: null, 
                audio:episode.media_url, 
                image: episode.podcast.image_url, 
                title:episode.name, 
                pk:episode.pk,
                podcast_pk:episode.podcast.pk,
            }
            var playList = []
            playList.push(playlistObj);
            setCurPlaylist(playList);
        }
    }

    return (
        <>  
            {error != "" ? <Alert severity="error"> {error}</Alert> : null }
                <div className="episode-page-items">
                  <Fuego on={playing} pk={pk}/>
                   
                  <div className="episode-page-column">

                           <IconButton
                              onClick={clickMenu}
                              size="small"
                              >
                              <Image image={episode.podcast.image_url} />
                            </IconButton>
                      
                      <div className="episode-page-small">Click Image for more</div>
                      <div className={"episode-page-play-button"}>
                          {loggedIn 
                            ? <PlaylistPopup episode_pk={pk}/>
                            : null
                          }
                          <IconButton style={{size:"50px"}} onClick={clickPlay}>
                              {playing 
                               ? <SurroundSoundIcon style={{color:"green", fontSize:"50px"}}/>
                               : <PlayCircleOutlineIcon style={{fontSize:"50px"}} color="primary" />
                              }
                          </IconButton>
                      </div>                       
                    </div>
                      <div className="episode-page-back-button">
                        <Button
                            variant="outlined"
                            onClick={goPodcast}
                            color="primary"
                            >
                          To Podcast
                        </Button>
                      </div>
                    <Menu
                        id="episode-page-menu-id"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        style={{maxWidth:"100%"}}                      
                        >
                        <div className="episode-page-container">
                            <Button
                                variant="outlined"
                                onClick={goPodcast}
                                color="primary"
                                >
                                To Podcast
                            </Button>
                        </div>
                    </Menu>
                </div>

              <div className="episode-page-main-1">
                <div className="episode-page-container">
                  <div className="episode-page-row">
                    <div className="episode-page-title">
                      {episode.name}
                      <EpisodeLike 
                        numLikes={numLikes} 
                        setNumLikes={setNumLikes}
                        userLiked={userLiked}
                        setUserLiked={setUserLiked}
                        episode_pk={episode.pk} />
                      
                      <div className="episode-right">
                        {episode.cur_time  != 0
                        ? <div className= "episode-page-location">
                           Current Location: {convertSeconds(episode.cur_time)}
                         </div>
                        : null
                        }
                      </div>
                    </div>

                    <div className="episode-page-row">
                      <div className="episode-page-share">
                        <Share/>
                      </div>
                  </div>
                  </div>
                    
                  <hr/>
                </div>
                <hr/>
                <div className="episode-page-container">
                  <ShowMoreText
                      lines={3}
                      more='more'
                      less='less'
                      className="episode-wrapper"
                      expanded={false}
                   >
                    {episode.description}
                   </ShowMoreText>
                 </div>
              </div>

              <Grid container>
                <Grid item xs={false} md={1}/>
                <Grid item xs={12} md={9}>
                  <div className="episode-page-container">
                    {loggedIn 
                      ? <CreateEpisodeComment 
                          render={rerenderComments}
                          setRender={setRerenderComments}
                          /> 
                      : <Button
                          size="small"
                          onClick={goLogin}
                          color="inherit"
                          >
                        Login to Comment!
                      </Button>
                    }
                  </div>
                  <RootCommentList render={rerenderComments} setRender={setRerenderComments} />
                </Grid>
                <Grid item xs={false} md={2}/>
              </Grid>
        </>
        );
}