import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import PauseIcon from '@material-ui/icons/Pause';
import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';
import { PlaylistContext } from "views/PlaylistPage/PlaylistContext.js";
import { AudioPlayerContext } from "components/AudioPlayer/AudioPlayerContext.js";
import Badge from '@material-ui/core/Badge';
import PlaylistLike from "components/Likes/PlaylistLike.js";
import Button from '@material-ui/core/Button';

import Menu from '@material-ui/core/Menu';

import SubscribeButton from 'components/Subscribe/SubscribeButton.js'
import { convertSeconds } from 'utils/Utils.js';
import Image from "views/PlaylistPage/Image.js";
import Share from 'components/Share/Share.js'
import axios from "axios"
import Username from 'components/Profile/Username.js';

import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

import 'assets/css/PlaylistsPage.css';

const useStyles = makeStyles((theme)=>({
  root:{
    "&:hover":{
      color:"red !important",
    }
  }
}))

export default function PlaylistPage(){
  const classes = useStyles()
  const [error, setError] = useState("")
  let history = useHistory()
  const [success, setSuccess] = useState("");
  const [render, setRender] = useState(false)
  const [playlistObj, setPlaylistObj] = useState({name:"",episodes:[],public:false, user:{}, num_likes:0, cur_user_liked:false});
  const [redirect, setRedirect] = useState(false);
  const [onMobile, setOnMobile] = useState(false);
  const [curIndex, setCurIndex] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPodcast, setMenuPodcast] = useState(0)
  const [userSub, setUserSub] = useState(false);
  const [numSubs, setNumSubs] = useState(0)

  const { pk } = useParams();

  const { setGlobalPlaylists, globalPlaylists, 
  playlistRerender, setPlaylistRerender } = useContext(PlaylistContext);

  const { setCurPlaylist, curPlaylist, trackIndex, setTrackIndex } = useContext(AudioPlayerContext);

  const playlist_url = localStorage.getItem("__APIROOT_URL__") + 'userfeatures/playlists'
  const playlist_detail = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/playlist_detail/${pk}`)
  const episode_playlist_url = localStorage.getItem("__APIROOT_URL__") +'userfeatures/episode_playlists';
  
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
      /**
          Hook to use on window inner width
      */
      mobileSetter()
      window.addEventListener('resize', mobileSetter );

      return () => window.removeEventListener('resize', mobileSetter);

  }, [window.innerWidth])

  useEffect(()=>{
    /*
      Use effect hook for setting playlist obj
    */
    const temp = globalPlaylists.filter(x => x.pk == pk)
    
    if(temp.length == 0){
      // Playlist obj does not exist in user's playlists.  
      setIsOwner(false);
      GetValidToken().then(()=>{
        // First try submitting an authentication header
        axios({
                method: 'get',
                url: playlist_detail,
                headers: {
                  'Content-Type':'application/json',
                  'Accept':'*/*',
                  'Authorization': GetAuthHeader()
                }
            }).then((response) => {
              if(response.data){
                setPlaylistObj(response.data);

                if(response.data.public){
                  setNumLikes(response.data.num_likes);
                  setUserLiked(response.data.cur_user_liked);
                  setUserSub(response.data.cur_user_sub)
                  setNumSubs(response.data.num_subs)
                }
              }
            }).catch((error) => {
               setRedirect(true);
            })      
      }).catch((msg)=>{
        // Auth error, Try anonymously
          axios({
              method: 'get',
              url: playlist_detail,
              headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
              }
          }).then((response) => {
            if(response.data){
              setPlaylistObj(response.data);

              if(response.data.public){
                setNumLikes(response.data.num_likes);
                setUserLiked(response.data.cur_user_liked);
                setUserSub(response.data.cur_user_sub)
                setNumSubs(response.data.num_subs)
              }
            }
          }).catch((error) => {
             setRedirect(true);
          })        
      })

    }else{
      setIsOwner(true);
      setPlaylistObj(temp[0]);
      setNumLikes(temp[0].num_likes);
      setUserLiked(temp[0].cur_user_liked)
    }

  },[globalPlaylists, pk])


  if(redirect) {
    return (<Redirect to="/"/>); 
  }

  const setAudioPlaylistandPlayFromIndex = (index) => {
    
    // Note this is different from playlistObj. Sorry for the confusion
    const audioPlayerList = playlistObj.episodes.map(episode =>(
      {playlist_pk:pk,
      playlist_name:playlistObj.name,
      audio:episode.episode.media_url, 
      image: episode.episode.podcast.image_url, 
      title:episode.episode.name,
      pk:episode.episode.pk,
      podcast_pk:episode.episode.podcast.pk,
    }
    ))

    if(curPlaylist.length > 0 && curPlaylist[trackIndex].playlist_pk !== playlistObj.pk){
      setCurPlaylist(audioPlayerList);
    }else if(curPlaylist.length <= 0){
      setCurPlaylist(audioPlayerList);
    }

    setTrackIndex(Number(index));  
      
  }

  const playPlaylistFromIndex = (event) => {
    const index = event.currentTarget.value
    setAudioPlaylistandPlayFromIndex(index);
  }

  const playFromBeginning = () => {
    setAudioPlaylistandPlayFromIndex(0);
  } 

  const removeEpisodeFromPlaylist = (episode_pk, name) => {
      if(!isOwner){
        return;
      }
      /**
        Fired when user "unchecks" episode from playlist
      */
      return GetValidToken().then(()=>{
            axios({
              method: 'delete',
              url: episode_playlist_url,
              headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
              },
              data:{
                'episode_pk':episode_pk,
                'playlist_pk':pk
              }

          }).then((response) => {
             if(response.data) {
               setPlaylistRerender(!playlistRerender)
               setSuccess("Successfully removed " + name)
              }

          }).catch((error) =>{
            if(error.response && error.response.data && error.response.data.detail){
              setError(error.response.data.detail);
            }else{
              setError("Something went wrong. Please try again later")
            }
          });
          return null
        }).catch((msg) =>{
            setError(msg);
            return null
        })       
    }



  const deletePlaylist = () => {
    if(!isOwner){
      return;
    }
    if(!window.confirm("Are you sure you want to delete this playlist?")){
      return;
    }
    return GetValidToken().then(()=>{
          axios({
            method: 'delete',
            url: playlist_url,
            headers: {
              'Content-Type':'application/json',
              'Accept':'*/*',
              'Authorization': GetAuthHeader()
            },
            data:{
              'playlist_pk':pk
            }

        }).then((response) => {
           if(response.data) {
             setPlaylistRerender(!playlistRerender)
            }

        }).catch((error) =>{
          if(error.response && error.response.data && error.response.data.detail){
            setError(error.response.data.detail);
          }else{
            setError("Something went wrong. Please try again later")
          }
        });
        return null
      }).catch((msg) =>{
          setError(msg);
          return null
      })
  }
  
  const goEpisode = (e, episode_pk) =>{
    e.preventDefault()
    history.push(`/episode/${episode_pk}`)
  }

  const clickMenuPodcast = (e) => {
    e.preventDefault()
    history.push(`/podcast/${menuPodcast}`)
  }

  const clickMenu = (e, podcast_pk) =>{
    e.preventDefault()
    setMenuAnchor(e.currentTarget)
    setMenuPodcast(podcast_pk)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return(
    <>
      {error !== "" ? <Alert severity="error"> {error} </Alert> : null}
      {success !== "" ? <Alert severity="success"> {success} </Alert> : null}
      <Grid container className="playlist-container">
        <Grid item md={7}>
         <Tooltip title={playlistObj.public == true ? "Playlist is public to the world wide web" : "Only you can see this playlist"}>
           <Badge badgeContent={playlistObj.public == true ? "Public" : "Private"} color={playlistObj.public == true ? "primary" : "error"}>
              <h3>{playlistObj.name}</h3>
            </Badge>          
          </Tooltip>
        </Grid>
        <Grid item xs={12} lg={4}>
          {(playlistObj.public)
            ? <div className="playlist-subscribe">                        
                <SubscribeButton 
                  userSubbed={userSub}
                  setUserSubbed={setUserSub}
                  numSubs={numSubs}
                  pk={playlistObj.pk}
                  type='playlist'
                  disabled={isOwner}
                />
              </div>
            : null
          }
        </Grid>
        <Grid item xs={7}>
          <div className="playlist-container-row">
            <div className="playlist-row-item">
              {!isOwner
                ? <p>By: {playlistObj.user.username ? <Username text ={playlistObj.user.username} pk ={playlistObj.user.pk}/> : <>???</>}</p>
                : null
              }
            </div>

            <div className="playlist-row-item">
              <h6>{playlistObj.episodes.length} episode{playlistObj.episodes.length == 1 ? null: <>s</>} </h6>
              {(curPlaylist.length > 0 && curPlaylist[0].playlist_pk === pk)
                ? <Tooltip title="Now playing"><IconButton> <SurroundSoundIcon style={{color:"green", fontSize:"50px"}}/></IconButton></Tooltip> 
                : <IconButton onClick={playFromBeginning}> <PlayCircleOutlineIcon style={{color:"blue",fontSize:"50px"}}/> </IconButton>
              }
            </div>
        </div>
        </Grid>
        <Grid item xs={10} className="playlist-container-row">
            {playlistObj.public ?
              <PlaylistLike 
                numLikes={numLikes}
                setNumLikes={setNumLikes}
                userLiked ={userLiked}
                setUserLiked={setUserLiked}
                playlist_pk={playlistObj.pk}/>
            :null
            }
            
          <div className="playlist-share">
            {playlistObj.public == true ? <Share /> : null}
          </div>
        </Grid>

        <Grid item xs={2} className="playlist-container-row">
          {isOwner 
            ? <IconButton onClick={deletePlaylist}>
                <DeleteForeverIcon className={classes.root}/>
              </IconButton>
          : null
        }
        </Grid>        
      </Grid>

    {playlistObj.episodes.map((episode, i) =>(
      <React.Fragment key={episode.episode.pk}>
        <Paper style= {{"maxWidth":"100%"}} elevation={0}>
          <div className="playlist-container-row">
            <Button onClick={e => clickMenu(e, episode.episode.podcast.pk)} size="small" >
              <Image image={episode.episode.podcast.image_url}/>
            </Button>            
            <Menu
                id= {`playlist-page-menu-${episode.episode.pk}`}
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                style={{maxWidth:"100%"}}                      
                >
                <div className="episode-page-container">
                    <Button
                        variant="outlined"
                        onClick={clickMenuPodcast}
                        color="primary"
                        >
                        To Podcast
                    </Button>
                </div>
            </Menu>            

              <div className="playlist-wrapper">
                {onMobile 
                  ? <div className="playlist-title-small"><Button color= "inherit" onClick={(e)=>goEpisode(e, episode.episode.pk)}>{episode.episode.name}</Button></div>
                  : <div className="playlist-title"><Button color="inherit" onClick={(e)=>goEpisode(e, episode.episode.pk)}>{episode.episode.name}</Button></div>
                }
                {onMobile 
                  ? <div className="playlist-subtitle-small">Current Location: {convertSeconds(episode.time)}</div>
                  : <div className="playlist-subtitle">Current Location: {convertSeconds(episode.time)}</div>
                }
                
                { ( curPlaylist.length > 0  && curPlaylist[trackIndex] &&
                  curPlaylist[trackIndex].playlist_pk == pk && 
                  curPlaylist[trackIndex].pk == episode.episode.pk) 
                  ? <Tooltip title="Now playing"><IconButton> <SurroundSoundIcon style={{color:"green"}}/></IconButton></Tooltip> 
                  : <IconButton onClick={playPlaylistFromIndex} value={i}> <PlayCircleOutlineIcon/> </IconButton>
                }
                                            
              </div>
              <div className="playlist-container-right">
                {isOwner 
                  ? <IconButton onClick={()=>removeEpisodeFromPlaylist(episode.episode.pk, episode.episode.name)}>
                      <CloseIcon className={classes.root}/>
                    </IconButton>  
                  : null
                }
              </div>
          </div>
        </Paper>
      </React.Fragment>
      ))}
     
    </>
    )
}