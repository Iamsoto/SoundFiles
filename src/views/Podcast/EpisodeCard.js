import React, { useState, useEffect, useContext } from 'react'

import { makeStyles } from "@material-ui/core/styles";
import { LoginContext } from 'auth/LoginContext.js';
import PlaylistPopup from 'components/PlaylistPopup/PlaylistPopup.js';
import Info from "components/Typography/Info.js";
import Small from "components/Typography/Small.js";
import ShowMoreText from 'react-show-more-text';
import Box from '@material-ui/core/Box';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';


import Download from 'components/Download/Download.js';
import Button from 'components/CustomButtons/Button.js';
import EpisodeLike from 'components/Likes/EpisodeLike.js';
import { AudioPlayerContext } from 'components/AudioPlayer/AudioPlayerContext.js';
import { convertDate } from "utils/Utils.js";
import { convertSeconds } from "utils/Utils.js"
import { useHistory } from 'react-router-dom';

import styles from "assets/jss/Soundhub/SoundhubViewStyle.js";
import 'assets/css/Episodes.css'

const useStyle = makeStyles(styles);

export default function EpisodeCard({episode, image_url, podcast_pk}) {
    const classes = useStyle();
    const { loggedIn,  setLoggedIn } = useContext(LoginContext);
    const { setCurPlaylist, curPlaylist, trackIndex, setTrackIndex } = useContext(AudioPlayerContext)
    const [disabled, setDisabled] = useState(false)
    const [onMobile, setOnMobile] = useState(false)
    const [numLikes, setNumLikes] = useState(0)
    const [userLiked, setUserLiked] = useState(false)

    let history = useHistory()

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
        setNumLikes(episode.num_likes)
        setUserLiked(episode.cur_user_liked)

    }, [episode])

    const toggleDisabled = () => {
        setDisabled(!disabled)
    }

    const playingCur = (episode_pk) => {
        if(curPlaylist!= null && curPlaylist[trackIndex] != null && curPlaylist[trackIndex].pk == episode_pk){
            return true
        }else{
            return false
        }
    }

    const handlePlay = (e, title, pk) =>{
        /*
            Talk to the grand Audio context
            Create a playlist of size = 1 
            and give it to the audioplayer
        */
        e.preventDefault();
        var playlist = []
        playlist.push(
            {playlist_pk:null,
            playlist_name:null, 
            audio:e.currentTarget.value, 
            image: image_url, 
            title:title, 
            pk:pk,
            podcast_pk:podcast_pk
        })
        setCurPlaylist(playlist);
    }

    const clickViewDiscussion = (event, episode_pk) => {
        event.preventDefault()
        history.push(`/episode/${episode_pk}`);
    }



    return (

    <Paper elevation={1}>
     
     <div className="episode-container">
        <div className="episode-row">
            <div className={classes.episodeCard}>
                <div className="episode-title">{episode.name}</div>
                <div className="episode-date">{convertDate(episode.pub_date)}</div>
                <EpisodeLike 
                    numLikes={numLikes}
                    setNumLikes={setNumLikes}
                    userLiked={userLiked}
                    setUserLiked={setUserLiked}
                    episode_pk={episode.pk}
                />
            </div>

            <div className="episode-right">
                <div className="episodes-column">
                    {loggedIn 
                    ? <div className={classes.episodeButtonsSpan}>
                        <PlaylistPopup episode_pk = {episode.pk} extra_func={toggleDisabled}/>
                      </div> 
                    : null}

                    {playingCur(episode.pk) 
                        ? <SurroundSoundIcon style={{color:"green"}} fontSize="large"/>
                        : null
                    }
                </div>
            </div>
        </div>
                       
        <div className= "episode-row">
            <ShowMoreText
              lines={2}
              more='more'
              less='less'
              className="episode-wrapper"
              expanded={false}
            >
                {episode.description}
            </ShowMoreText>
        </div>
        
        <div className="episode-row">
            {episode.cur_time !== 0 
            ? <div className="episode-location">Current Location: {convertSeconds(episode.cur_time)}</div>
            : null
            }
            <div className="episode-duration">{convertSeconds(episode.duration)}</div>
        </div>
        <Divider/>
        

        <div className="episode-row">
            <Button 
                color="rose"
                value={episode.media_url}
                onClick={e => handlePlay(e, episode.name, episode.pk)}
                >Play
                </Button>
                <div className="episode-discussion-button">
                <Button 
                    color="primary"
                    onClick={(e)=> clickViewDiscussion(e, episode.pk)}
                    >
                    Go to Discussion
                </Button>
            </div>
            <div className="episode-right">
                <Download src ={episode.media_url} name={episode.name}/>
            </div>
        </div>



    </div>
</Paper>
        )

}