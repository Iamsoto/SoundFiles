import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import Radio from '@material-ui/core/Radio';
import RemoveIcon from '@material-ui/icons/Remove';

import { PlaylistContext } from 'views/PlaylistPage/PlaylistContext.js' 

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';

import 'assets/css/PlaylistPopup.css';

import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '10px',
      maxWidth:'100%',
    },
  },
  backdrop: {
    zIndex:1300,
    color: '#fff',
  },
  title: {
    margin:"10px",
    color:"#999",
    width:"200px",
  }
}));


export default function PlaylistPopup({episode_pk, extra_func}){
    const classes = useStyles();

    const playlist_url = localStorage.getItem("__APIROOT_URL__") + 'userfeatures/playlists';
    const episode_playlist_url = localStorage.getItem("__APIROOT_URL__") +'userfeatures/episode_playlists';

    const [anchorEl, setAnchorEl] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [addNew, setAddNew] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("")
    const [containsEpisode, setContainsEpisode] = useState(false);
    const [rerender, setRerender] = useState(true);
    const [makePublic, setMakePublic] = useState(false);

    //const { getLoggedIn, setLoggedInWrapper } = useContext(LoginContext);
    const { setGlobalPlaylists, globalPlaylists, 
      playlistRerender, setPlaylistRerender } = useContext(PlaylistContext);

    useEffect(()=>{
      /**
        On exit...
      */
      return ()=> setMakePublic(false);
    },[])

    useEffect(() => {
      var mounted = true;
      
      /**
         determine if the user has this episode
          in any of their playlists
      */
         
      if(mounted){

       var temp_playlists = globalPlaylists;
       var found = false;
       temp_playlists.forEach((pl)=>{
          pl.episodes.forEach(ep=>{
            if(ep.episode.pk == episode_pk){
              setContainsEpisode(true);
              found = true;
            }
          })
       })
       if(!found){
        setContainsEpisode(false);
       }     
       
      }     

    }, [globalPlaylists])


    const onClick = (event) => {
        /**
          Open this component
        */
        event.preventDefault();
        if(extra_func){
          extra_func()
        }
        
        setAnchorEl(event.currentTarget)
    }


    const handleClose = () =>{
        /*
          Close this component
        */
        if(extra_func){
          extra_func()
        }
        
        setAnchorEl(null)
    }


    const addNewPlaylist = (onSuccess) => {
        /**
          Create a new playlist
        */
       GetValidToken().then(()=>{
          axios({
            method: 'post',
            url: playlist_url,
            headers: {
              'Content-Type':'application/json',
              'Accept':'*/*',
              'Authorization': GetAuthHeader()
            },
            data: JSON.stringify({
              'name': newPlaylistName,
              'make_public':makePublic
          })
          }).then((response) => { 
          // Success!
                
              if(response.data && response.data.pk && response.data.name){
                 if(onSuccess){
                   // Onsuccess should call re-render
                   onSuccess(response.data.pk)
                   
                 }else{
                  setPlaylistRerender(!playlistRerender)
                 }
                 
                 setNewPlaylistName("")// Clear this
              }        
          }).catch((error) => {
            // Server returned something > 4x
            //console.log(error);
            if(error.response){
              if(error.response.data){
                var obj = error.response.data;
                setErrorMsg(obj.detail);
              }else{
                setErrorMsg("Something went wrong. Please try again later.");
              }
            }else{
              setErrorMsg("Something went wrong. Please try again later.");
            }
            //return "Error..."
          })

      }).catch((msg) => {
        /**
          Authentication error set logged in to false
        */
        setErrorMsg(msg);
      })
    }

    const removeEpisodeFromPlaylist = (playlist_pk) => {
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
                'playlist_pk':playlist_pk
              }
          }).then((response) => {
             if(response.data) {
               setPlaylistRerender(!playlistRerender)
              }

          }).catch((error) =>{
            if(error.response && error.response.data && error.response.data.detail){
              setErrorMsg(error.response.data.detail);
            }else{
              setErrorMsg("Something went wrong. Please try again later")
            }
          });
          return null
        }).catch((msg) =>{
            setErrorMsg(msg);
            return null
        })       
    }

    const addEpisodeToPlaylist_main = (playlist_pk)=>{
      return GetValidToken().then(()=>{
            axios({
              method: 'post',
              url: episode_playlist_url,
              headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
              },
              data:{
                'episode_pk':episode_pk,
                'playlist_pk':playlist_pk
              }

          }).then((response) => {

             setPlaylistRerender(!playlistRerender)
             //setMakePublic(false)
             //response.data

          }).catch((error) =>{
            if(error.response && error.response.data && error.response.data.detail){
              setErrorMsg(error.response.data.detail);
            }else{
              setErrorMsg("Something went wrong. Please try again later")
            }
            //setMakePublic(false)
          });
          return null
        }).catch((msg) =>{
            // Authentication error
            // setLoggedInWrapper(msg)
            setErrorMsg(msg);
            return null
        })    
    }

    const closeAll = (event) => {
      setAnchorEl(null)
    }

    const addRemoveEpisodeToPlaylist = (event) => {
      /**
        Add an episode to a playlist
      */
      //event.preventDefault();
      const checked = event.target.checked
      const playlist_pk = event.target.value
      if(checked){
        addEpisodeToPlaylist_main(playlist_pk)
      }else{
        removeEpisodeFromPlaylist(playlist_pk)
      }
      
    }

    const submitWithNewPlaylist = (event) => {
        /*
          For some reason this WILL NOT work as a regular promise chain.
          I apologize to myself and any and all future developers who 
          need to deal with this...
        */
        event.preventDefault()
        addNewPlaylist(addEpisodeToPlaylist_main);
    }

    const changeMakePublic = (event) =>{
      //event.preventDefault()
      setMakePublic(!makePublic)
    }

    return (
        <>
          
          <IconButton onClick={onClick}>
            {containsEpisode 
              ? <LibraryAddIcon color="primary"/>
              :<LibraryAddIcon />
            }
          </IconButton>
                
            <Backdrop className={classes.backdrop} open={Boolean(anchorEl)}>
              <Grid container p={2}>
                <Menu
                  id="playlist-popup-id"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >

                <IconButton onClick={closeAll}><CloseIcon/></IconButton>
                
                <Grid item>
                  <h6 className={classes.title}> Playlists: </h6>
                  <FormControl>
                      <FormGroup row={false}>
                          {globalPlaylists.map((cur_playlist) => (
                           <div key={cur_playlist.pk}>
                           <FormControlLabel
                              value="Add To" 
                              label={cur_playlist.name}
                              labelPlacement="end"
                              style={{paddingLeft:"10px"}}
                              control={
                                <Checkbox 
                                  checked={(cur_playlist.episodes.findIndex((ep) => ep.episode.pk == episode_pk) !== -1) }
                                  onChange={addRemoveEpisodeToPlaylist}
                                  color="primary"/>}
                                  value={cur_playlist.pk}
                                />
                            </div>
                            ))}
                          <Divider/>
                          {!addNew
                          ? <IconButton onClick={(event)=>setAddNew(!addNew)}>
                             <FormControlLabel 
                                value="Create Playlist" 
                                label="Create Playlist"
                                labelPlacement="end"
                                style={{margin:"2px"}}
                                control={
                                    <AddIcon /> 
                                  }
                                />
                            </IconButton>
                          : <FormControlLabel 
                                value="Create Playlist" 
                                label="Create Playlist"
                                labelPlacement="end"
                                style={{margin:"2px"}}
                                control={
                                  <IconButton onClick={(event)=>setAddNew(!addNew)}>
                                    <RemoveIcon/> 
                                  </IconButton>}
                                >
                              </FormControlLabel> 
                          }
                          </FormGroup>
                  </FormControl>
                  {errorMsg !== "" ? <Alert severity="error">{errorMsg}</Alert> : null}
                </Grid>
                <Grid item>
                  {addNew 
                      ? <form className={classes.root} onSubmit={e => { e.preventDefault(); }}>
                          
                            <TextField 
                              id="add-new-playlist-textfield" 
                              helperText="Enter Playlist Name:"
                              value={newPlaylistName}
                              onChange={(e) => setNewPlaylistName(e.target.value)}
                            />
                            <div className="playlistPopup-container">
                              <FormControlLabel label="Make public" 
                                control={
                                    <Checkbox 
                                        checked={makePublic}
                                        onChange={changeMakePublic}
                                        color="secondary"
                                      />
                                }
                            />
                            <Button color="inherit" onClick={submitWithNewPlaylist}>Save</Button>
                          </div>
                        </form> 
                      : null}
                </Grid>

              </Menu>
            </Grid>
          </Backdrop>
        </>
        )
}