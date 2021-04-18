import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AudioContext } from "components/AudioPlayer/AudioContext.js"
import { AudioPlayerContext } from "components/AudioPlayer/AudioPlayerContext.js";
import { LoginContext } from "auth/LoginContext.js";
import { PlaylistContext } from "views/PlaylistPage/PlaylistContext.js";
import EpisodePage from "views/EpisodePage/EpisodePage.js"
import GetValidToken from "auth/GetValidToken.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import SocialPage from "views/SocialPage/SocialPage.js"
import CommentView from "views/CommentView/CommentView.js";
import GoodbyePage from "views/GoodbyePage/GoodbyePage.js";
import RegisterPage from "views/RegisterPage/RegisterPage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import PodcastView from "views/Podcast/PodcastView.js";
import Landing from "views/Landing/Landing.js";
import PlaylistPage from "views/PlaylistPage/PlaylistPage.js"

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Header from "components/Header/Header.js";

import AudioPlayer from "components/AudioPlayer/AudioPlayer.js"

//import "assets/fonts.css";
import GlobalStyles from "assets/jss/root.js";
import "assets/scss/material-kit-react.scss";

const useStyles = makeStyles(GlobalStyles);

const App = () => {

  const classes = useStyles();

  const [globalPlaylists, setGlobalPlaylists] = useState([]);
  const [playlistRerender,setPlaylistRerender] = useState(false);
  const [curPlaylist, setCurPlaylist] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const [onMobile, setOnMobile] = useState(false)
  const [height, setHeight] = useState(false);

  const closePlayer = () => {
    /**
      function passed to the audio player to close
      itself 
    */

    setCurPlaylist([]);
    if(audioRef.current){
      audioRef.current = null; // Set audioref current to null
    }
    setAudioProgress(0);
    
  }


  const checkLoggedIn = () => {
      GetValidToken().then((response)=>{
        //alert("successful login")
      /*  Successful authentication */
      if(!loggedIn){
        setLoggedIn(true);
      }

    }).catch(msg => {
      /* Authentication failure */
        if(loggedIn){
          setLoggedIn(false);
        }  
    })
  }

  const mobileSetter = () => {
      setHeight(window.innerHeight);

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

    }, [window.innerWidth, window.innerHeight])


  useEffect(()=> {
    /* 
      Every 5 minutes, ping to make sure we're still logged in, 
      and the refresh token is still good 
    */
    checkLoggedIn()

    const interval = setInterval(() => {
      if(loggedIn){
        checkLoggedIn()
      }
      
    }, 300000);

    return () => clearInterval(interval);

  },[])

  return (
   <Router>
    <LoginContext.Provider value={{loggedIn, setLoggedIn}}>
      <AudioContext.Provider value={audioRef}>
        <AudioPlayerContext.Provider value={{ setCurPlaylist, curPlaylist, trackIndex, setTrackIndex }}>
          <PlaylistContext.Provider value={{setGlobalPlaylists, globalPlaylists, playlistRerender, setPlaylistRerender}}>
            
            <Header
              brand="SoundFiles"
              fixed
              changeColorOnScroll
              changeColorOnScroll={{
                height: 200,
                color: "white"
            }}
            />

            {height >= 700
            ?<Box m={9}/>
            :<Box m={11 + (height - 700)/100}/>
            }
            <Switch>
              <Route path="/social/" children={<SocialPage />} />
              <Route path="/episode-comment/:pk" children={<CommentView />} />
              <Route path="/podcast/:pk" children={<PodcastView />} />
              <Route path="/playlist/:pk" children={<PlaylistPage />} />
              <Route path="/episode/:pk" children={<EpisodePage />} />
              <Route path="/login" component={LoginPage}/>
              <Route path="/register" component={RegisterPage}/>
              <Route path="/goodbye" component={GoodbyePage} />
              <Route path="/" component={Landing} />
              
            </Switch>
          
            <Box m={14}></Box>

            <Grid container className={classes.container}>
              <Grid item xs={12}>
                {curPlaylist.length > 0 
                  ? <AudioPlayer  close={closePlayer}/> 
                  : null
                  }
              </Grid>
            </Grid>

        </PlaylistContext.Provider>
      </AudioPlayerContext.Provider>
    </AudioContext.Provider>
  </LoginContext.Provider>

  </Router>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
