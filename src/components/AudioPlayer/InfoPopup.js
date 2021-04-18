import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import IconButton from '@material-ui/core/IconButton';
import {useHistory} from 'react-router-dom';

import 'assets/css/AudioPlayer.css';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative",
    height:100,
  } 
}))

export default function InfoPopup({
        anchorEl, 
        msg,
        playlist_pk,
        episode_pk,
        podcast_pk,
        playlist_name, handle_close, 
        duration, 
        cur_time
    }){
    
    const classes = useStyles()
    let history = useHistory()
    return (
        <>
          <Menu
            id="info-popup-menu-id"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handle_close}
            >           
                <Grid container>
                    <Grid item xs={12}>
                        <div className="audio-title">{msg}</div>
                    </Grid>
                    {playlist_name !== null
                        ?  <Grid item xs={12}> 
                            <div className="audio-sub-title">
                                <IconButton size="small" onClick={()=>history.push(`/playlist/${playlist_pk}`)}>
                                    <PlaylistPlayIcon/>
                                    {playlist_name}
                                </IconButton>
                            </div> 
                            </Grid>
                        : null
                    }
                    <Grid item xs={12}>
                        <div className="audio-sub-title">{cur_time}/{duration}</div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="audio-sub-title">Blank</div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="audio-sub-title">Blank</div>
                    </Grid>

                    <Button size="small" variant="outlined" color="primary" onClick={(e)=>{e.preventDefault();history.push(`/episode/${episode_pk}`)}}>
                        Go to Episode Discussion
                    </Button>
                    
                    
                      <Button size="small" variant="outlined" color="primary" onClick={(e)=>{e.preventDefault();history.push(`/podcast/${podcast_pk}`)}}>
                        Go to Podcast
                      </Button>
                    
                </Grid>

            </Menu>
        </>
        )
}