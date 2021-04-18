import React, { useState, useEffect, useRef, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';

import Hidden from '@material-ui/core/Hidden';
import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';
import AudioImage from "components/AudioPlayer/AudioImage.js"
import { AudioPlayerContext } from "components/AudioPlayer/AudioPlayerContext.js";
import { AudioContext } from "components/AudioPlayer/AudioContext.js";
import InfoPopup from 'components/AudioPlayer/InfoPopup.js';
import AudioControls from 'components/AudioPlayer/AudioControls.js';
import TimeSlider from 'components/AudioPlayer/TimeSlider.js';
import { useHistory } from "react-router-dom";

import 'assets/css/AudioPlayer.css';
import axios from 'axios'

export default function AudioPlayer({close}){
/*
    For reference on constructing an audio player: 
        https://github.com/Werter12/material-ui-audio-player
        and
        https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
*/
  const [trackProgress, setTrackProgress] = useState(0);
  const progressRef = useRef(trackProgress)
  const [savedLocation, setSavedLocation] = useState(-1);
  const savedLocationRef = useRef(savedLocation)

  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(isPlaying)
  const [onMobile, setOnMobile] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [popup, setPopup] = useState(null);
  
  //const [buffering, setBuffering] = useState(false)
  //const bufferingRef = useRef(buffering)

  const savePointURL = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/episode_save_point")
  const { setCurPlaylist, curPlaylist, trackIndex, setTrackIndex } = useContext(AudioPlayerContext);
  
  if(curPlaylist[trackIndex] == undefined || curPlaylist[trackIndex] == null){
    return null;
  }

  const { playlist_pk, playlist_name, title, pk, image, audio, podcast_pk } = curPlaylist[trackIndex];
  const audioRef = useContext(AudioContext);  
  // Audio state is used to trigger the useEffect()
  const [audioState, setAudioState] = useState(audioRef.current)

  const [duration, setDuration] = useState(0)
  
  let history = useHistory()


  const updateSavedLocation = (time) => {
    savedLocationRef.current = time;
    setTrackProgress(time);
  }

  const updateTrackProgress = (time) =>{
    progressRef.current = time;
    setTrackProgress(time);
  }

  const handleAudioRef = (r) => {
    /**
      Note: Currently, Because of the track progress state, 
        this function will be called many times... 
        the if statement is to make sure null values
        don't get used
        https://github.com/facebook/react/issues/11258
    */
    if(audioRef.current !== r && r !== null){
      audioRef.current = r;
      setAudioState(audioRef.current);
    }
  }

  const onPlayPauseClick = () =>{
    setIsPlaying(!isPlaying);
    isPlayingRef.current = !isPlaying;
  }

  const handleClose = () => {
    isPlayingRef.current = false;
    isPlaying(false)
    close()
  }

  const updateSavedLocationAPI = (time) => {
    time = Math.round(time)
    updateSavedLocation(time)
    GetValidToken().then(()=>{
      axios({
        method: 'post',
        url: savePointURL,
        headers: {
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Authorization': GetAuthHeader()
        },
        data: {
          episode_pk: pk,
          timestamp:time
        }
        }).then((response) => {
          
        }).catch((error) => {
          
         //pass do nothing...
        })      
    }).catch(msg =>{
      
    // Authentication error
    // Do nothing
    })
  }

  const handlePlayerTimeUpdate = (e) => {
    /*
      Handle player time update
        Also update buffer time here
    */
    e.preventDefault()
    if(! audioRef.current){
      // This is here, because it's possible to close player while audio loading
      return; 
    }
    let curTime = Math.round(audioRef.current.currentTime*10)/10
    if(curTime != progressRef.current){
      updateTrackProgress(curTime)
    }

    //console.log(savedLocationRef.current)
    if(Math.abs(curTime - savedLocationRef.current) > 180 || progressRef.current === 10){ // Every 3 minutes update saved location. Or after 10 seconds
      
      updateSavedLocationAPI(curTime)
    }
  }

  const handlePlay = (e)=> {
    if(audioRef.current && (isPlayingRef.current === true)){
      audioRef.current.play()
    }
  }

  const onScrub = (event, value) => {
    audioRef.current.pause()
    audioRef.current.currentTime = value;
    setIsPlaying(true);
    setTrackProgress(value);
  }

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {

    } else {
      setTrackIndex(Number(trackIndex) - 1);

    }
  }
  
  const toNextTrack = () => {
    if (trackIndex < curPlaylist.length - 1) {
      setTrackIndex(Number(trackIndex) + 1);      
    } else {

    }
  }

  const secondsToTime = (input) => {
    return new Date(input * 1000).toISOString().substr(11, 8)    
  }

  const fixTitle = (input) => {
    if(input.length > 53){
      return input.substring(0, 50).concat("...")
    }else{
      return input
    }
  }

  const onVolumeChange = (event, newVol) => {
    if(!isNaN(newVol) ){
        setVolume(newVol);
        audioRef.current.volume = newVol; 
    }
  }

  const setPopupAnchor = (event) => {
    setPopup(event.currentTarget);
  }

  const handlePopupClose = (event)=>{
    setPopup(null);
  }

  const mobileSetter = () => {
      if(window.innerWidth <= 600){
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

  },[window.innerWidth])


  useEffect(() => {
    /* useEffect hook for start + pause + play */

    if(isPlaying === false){

      if(audioRef != null && audioRef.current != null){
        
        audioRef.current.removeEventListener("canplay", handlePlay)
        audioRef.current.removeEventListener('timeupdate', handlePlayerTimeUpdate);
        audioRef.current.pause();        
      }

    }else{

      if(audioRef != null && audioRef.current != null){
        if(duration == 0){
          setDuration(audioRef.current.duration);
        }
        
        audioRef.current.addEventListener("canplay", handlePlay);
        audioRef.current.addEventListener('timeupdate', handlePlayerTimeUpdate);
        //console.log(audioRef.current.paused)
        if(audioRef.current.paused){
          audioRef.current.play()
        }
      }
    }
      
  }, [isPlaying, audioState])

  useEffect(()=>{
    /*
      Find any potential saved locations
    */
    
    GetValidToken().then(()=>{
      axios({
        method: 'get',
        url: savePointURL.concat(`?episode_pk=${pk}`),
        headers: {
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Authorization': GetAuthHeader()
        },
        }).then((response) => {
          if(response.data){
            if(audioRef !== null && audioRef.current !== null){
              audioRef.current.currentTime = response.data.time
            }
          }
        }).catch((error) => {
         //No saved location found, reset to 0
         updateTrackProgress(0)
         updateSavedLocation(-1)
        })      
    }).catch(msg =>{
    // Authentication error
      updateTrackProgress(0)
      updateSavedLocation(-1)
    })
  }, [curPlaylist, trackIndex])


  useEffect(() => {
    /* 
      useEffect unmount hook
    */
    
    //If closing without pausing...
    return () => {
      if(audioRef !== null && audioRef.current !== null){
        audioRef.current.pause();
        audioRef.current.removeEventListener("canplay", handlePlay)
        audioRef.current.removeEventListener('timeupdate', handlePlayerTimeUpdate);        
      }
    }
  }, []);


  return (
    <>
    <audio ref={handleAudioRef} 
      hidden={true} preload="auto" 
      id={`audio-ref-id-${pk}`} key={pk}
      >
        <source src={audio} />
    </audio>

    <div className="audio-player">
      <div className="audio-container">
        
        <div className="audio-column">
          <IconButton onClick={setPopupAnchor}>
            <AudioImage image = {image}/>
          </IconButton>
        </div>
        

        <InfoPopup
          anchorEl={popup}
          msg={title}
          episode_pk={pk}
          playlist_pk={playlist_pk}
          podcast_pk={podcast_pk}
          playlist_name={playlist_name}
          handle_close={handlePopupClose}
          duration={ 
            (audioRef.current != null && !isNaN(audioRef.current.duration)) 
              ? secondsToTime(audioRef.current.duration) 
              : "00:00:00" }
          cur_time={secondsToTime(trackProgress)}
        />

        
       {(!onMobile && playlist_pk != null) 
          ? <div className="audio-column">
              <IconButton size="small" onClick={ e=> history.push(`/playlist/${playlist_pk}`)}>
                <PlaylistPlayIcon/>{playlist_name} 
              </IconButton>
            </div>
          : null 
        }
           
        {(!onMobile && audioRef.current != null && !isNaN(audioRef.current.duration)) 
          ? <>
            <div className={onMobile ?'audio-column-mobile' : 'audio-column'}>
              <div className="audio-title" onClick={e => history.push(`/episode/${pk}`)}>{title}</div> 
              <div className="audio-sub-title">
                {secondsToTime(trackProgress)}/<b>{secondsToTime(audioRef.current.duration)}</b>
              </div>
            </div>
            </>
          : null
        }

        <div className="audio-column-large">
          { (audioRef.current != null && !isNaN(audioRef.current.duration))  
          ? <TimeSlider
            onScrub={onScrub}
            progress={trackProgress}
            max={audioRef.current.duration}
            onMobile={onMobile}
          />
          : null
          }
          <div className="audio-row">
            {(audioRef.current != null && !isNaN(audioRef.current.duration))
              
              ? <AudioControls
              isPlaying={isPlaying}
              onPrevClick={toPrevTrack}
              onNextClick={toNextTrack}
              onPlayPauseClick={onPlayPauseClick}
              atEnd={(trackIndex >= curPlaylist.length -1)}
              atBeginning={(trackIndex == 0)}
              onVolumeChange={onVolumeChange}
              volume={volume}
            />
            : <CircularProgress color = "secondary"/>
            }
          </div>
      </div>


      <IconButton
        onClick={close}

        >
        <CloseIcon style={ onMobile? {fontSize:"15px"} : {fontSize:"25px"}}/>
      </IconButton>
 

    </div>       
  </div>
  </>
  );


}
