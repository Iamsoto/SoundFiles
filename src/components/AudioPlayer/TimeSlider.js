import React, { useState, useEffect, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import 'assets/css/AudioPlayer.css';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';

export default function TimeSlider({progress, max, onScrub, onMobile}){
    const PrettoSlider = withStyles({
      root: {
        color: 'rgba(0, 0, 0, 0.5)',
        maxHeight: 5,
      },
      thumb: {
        height: onMobile ? 12 : 24,
        width: onMobile ? 12 : 24,
        backgroundColor: '#999',
        border: '2px solid currentColor',
        marginTop: onMobile ? -4 : -8,
        marginLeft: onMobile? -6 : -12,
        '&:focus, &:hover, &$active': {
          boxShadow: 'inherit',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
        transition:"none",
        '& *': {
          background: 'transparent',
          color: '#000',
        },
      },
      track: {
        height: onMobile ? 4 :8,
        borderRadius: onMobile? 2: 4,
      },
      rail: {
        height: onMobile ? 4: 8,
        borderRadius: onMobile ? 2: 4,
      },
    })(Slider);

    

    const formatSeconds = (input) =>{
      return new Date(input * 1000).toISOString().substr(11, 8)        
    }

    return(
    <>

      
    <PrettoSlider 
        valueLabelDisplay="auto" 
        aria-label="time slider" 
        defaultValue={0}
        step={0.1}
        value={progress}
        max={max}
        onChangeCommitted={onScrub}
        onChange={onScrub}
        valueLabelFormat={formatSeconds}
    />
    
    </>
        )
}