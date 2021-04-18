import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';

import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';

import 'assets/css/AudioPlayer.css';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative",
    height:90,
  } 
}))

export default function VolumeSlider({volume, onScrub, anchorEl, handleClose}){

    const classes = useStyles()

    const formatVolume = (input) =>{
      return (input * 100).toString().concat("%")
    }

    return(
    <>
      <Menu
        id="volume-slider-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        
        >
     <div className={classes.root}>
      <Slider 
          aria-label="volume slider"
          orientation="vertical"
          valueLabelDisplay="auto"
          step={0.1}
          value={volume}
          max={1}
          min={0}
          onChange={onScrub}
          valueLabelFormat={formatVolume}

      />
     </div>
    </Menu>
  
    </>
        )
}