import React,  { useState, useContext, useEffect }  from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';

import EpisodeCard from 'views/Podcast/EpisodeCard.js'
import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';
import { AudioPlayerContext } from 'components/AudioPlayer/AudioPlayerContext.js';
import { buildString } from './queryStrings.js'

import { useParams } from "react-router";
import axios from 'axios';

import styles from "assets/jss/Soundhub/SoundhubViewStyle.js";
import 'assets/css/Episodes.css'

const useStyle = makeStyles(styles);

export default function Episodes({image_url}){
    const classes = useStyle();

    const { setCurPlaylist, curPlaylist, trackIndex, setTrackIndex } = useContext(AudioPlayerContext);
    const { pk } = useParams();

    const [error, setError] = useState('');
    const [episodes, setEpisodes] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [onMobile, setOnMobile] = useState(false);

    // API URL for this component   
    const episode_base_url = localStorage.getItem("__APIROOT_URL__") + "podcasts/get_episodes" 

    const [queryParams, setQueryParams] = useState({
        podcast: pk,
        order_by: "time",
        asc: false,
        page: 1
    })

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

    const callAPIAuth = (url) =>{
        return axios({
          method: 'get',
          url: url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'authorization':GetAuthHeader()
          },
        })
    }

    const callAPI = (url) =>{
        /*
            Call our episode api, update the episodes state

            *No Permissions or Authentication needed*
        */
        return axios({
          method: 'get',
          url: url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          },   
        })
    }

    const handleAPI = () => {
        let url = buildString(episode_base_url, queryParams)
        GetValidToken().then((auth_response)=> {
            callAPIAuth(url).then((response) => {
                var data = response.data;
                if(data.results){
                    setEpisodes(data.results);
                    setTotalPages(data.total_pages);
                }else{
                    setError("Something Went bad, please try again later");
                }
                
            }).catch((error) => {
                if(error.response && error.response.data && error.response.data.detail){
                    setError(error.response.data.detail);  
                }else{
                    setError("Something bad happened here. Please try again later");
                }
            });

        }).catch(msg=>{
            // Authentication error
            // Use non-authenticated response
            callAPI(url).then((response)=>{
                var data = response.data;
                if(data.results){
                    setEpisodes(data.results);
                    setTotalPages(data.total_pages);
                }else{
                    setError("Something went bad. Plese try again later")
                }
            }).catch(error =>{
                if(error.response && error.response.data && error.response.data.detail){
                    setError(error.response.data.detail);  
                }else{
                    setError("Something bad happened here. Please try again later");
                }                
            })
        })

    }

    useEffect(()=>{
        /**
            Hook to use on window inner width
        */
        mobileSetter()
        window.addEventListener('resize', mobileSetter );

        return () => window.removeEventListener('resize', mobileSetter);

    }, [window.innerWidth])
    
    
    useEffect(() => {
        /*
            Call first time component is mounted, and when query params change
        */
        let mounted = true;
        
        handleAPI()

        return (() => mounted = false)
    }, [queryParams]);


    const handleOrderByChange = (event) => {
        /*
            Handle order by change
        */
        var params = {...queryParams};
        params.order_by = event.target.value;
        setQueryParams(params);
    }

    const handlePageChange = (event, page) => {
        /*
            Handle Page change
        */
        var params = {...queryParams};
        params.page = page;
        setQueryParams(params);
    }

    const handleAscending = (event) => {
        /*
            Handle ascending page
        */
        var params = {...queryParams};
        params.asc = !params.asc
        setQueryParams(params);
    }

    return (

        <Grid container className={classes.container}>
            <Grid container m={2}>
                <Grid item xs={12} md={8}>
                {error !== '' ? <Alert severity = "error"> {error} </Alert> : null}
                    <FormControl className={classes.soundFilesformControl}>
                        <FormLabel>Find Your Favorite Episodes</FormLabel>
                        <FormGroup row= {true}>
                            <FormControlLabel 
                                value="OrderBy" 
                                labelPlacement="bottom"
                                control={<Select
                                          className={classes.colorPrimary}
                                          id="episode-order-by-field-id"
                                          value={queryParams.order_by}
                                          onChange={handleOrderByChange}
                                          >
                                <MenuItem value="time">Upload Time</MenuItem>
                                <MenuItem value="likes">Popularity</MenuItem>
                                </Select>}
                                >
                            </FormControlLabel>
                                
                            <FormControlLabel 
                                value="ascending" 
                                label="ascending"
                                labelPlacement="end"
                                className={classes.colorPrimary}
                                control={<Checkbox
                                checked={queryParams.asc}
                                onChange={handleAscending}
                                color="primary"
                                ></Checkbox>}>
                            </FormControlLabel>
   
                        </FormGroup> 
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container className={classes.container}>
                <Grid item xs={12}>
                    {episodes.map((episode, i) => (
                      <div key={episode.guid}>
                        <Box m={2}/>
                            <Grow in ={true} style={{ transformOrigin: `0, ${Number(i) * 5}, 0` }}>
                                <EpisodeCard episode={episode} 
                                    image_url={image_url}
                                    podcast_pk={pk}
                                />
                            </Grow>
                      </div>             
                    ))}
                </Grid>
                <Box m={2}/>
                <Grid item xs={12}>
                    <Pagination
                    page={parseInt(queryParams.page)}
                    count={parseInt(totalPages)}
                    onChange={handlePageChange}
                    color="primary"
                    >    
                    </Pagination>
                </Grid>
                
            </Grid>
        </Grid>
        
        );
}