import React, { useEffect, useState } from 'react';


import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import IconButton from '@material-ui/core/IconButton';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import VolumeSlider from 'components/AudioPlayer/VolumeSlider.js'

import "assets/css/AudioPlayer.css"

export default function AudioControls({ 
  isPlaying, onPrevClick, onNextClick, 
  onPlayPauseClick, atEnd, atBeginning,
  onVolumeChange, volume }){ 

const [volumeSlider, setVolumeSlider] = useState(false)
const [anchorEl, setAnchorEl] = useState(null)

const onInitialVolumeClick = (event) => {
  /**
    Upon initial click of the volume button, 
    Change volume visible and set the anchor tag
    for the slider element
  */
  //setVolumeSlider(!volumeSlider)
  setAnchorEl(event.currentTarget)
}

const handleVolumeClose = (event, reason) =>{

  //setVolumeSlider(false);
  setAnchorEl(null);
}

useEffect(()=> {

}, [])

return (
    <div className="audio-controls">
      
      { !false ? 
      <IconButton 
        disabled={atBeginning} 
        style={{margin:"0px"}}
        onClick={onPrevClick}>
        <SkipPreviousIcon fontSize="small" style={{margin:"0px"}}/>
      </IconButton>
      : null}

      {isPlaying ? (
        <IconButton
          onClick={()=> onPlayPauseClick()}>
          <PauseIcon fontSize="small" style={{margin:"0px"}}/></IconButton>
      ) : (
        <IconButton style={{margin:"0px"}}
          onClick={()=> onPlayPauseClick()}
          >
          <PlayArrowIcon  fontSize="small" style={{margin:"0px"}}/>
        </IconButton>
      )}

      {!false ?
        <IconButton
          disabled={atEnd}
          onClick={onNextClick}
          style={{margin:"0px"}}
          >
        <SkipNextIcon fontSize="small" style={{margin:"0px"}}/>
      </IconButton>
    : null}

      <IconButton
        onClick={onInitialVolumeClick}
        >
        { 
          volume === 0.0 
          ? <VolumeOffIcon fontSize="small" style={{margin:"0px"}}/>
          : volume > 0.5 
            ? <VolumeUpIcon fontSize="small" style={{margin:"0px"}}/>
            : <VolumeDownIcon fontSize= "small" style={{margin:"0px"}}/>}
      </IconButton>

      <VolumeSlider
      anchorEl={anchorEl}
      onScrub={onVolumeChange}
      volume={volume}
      handleClose={handleVolumeClose}
      />

    </div>
  );
}
