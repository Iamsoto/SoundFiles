import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from "@material-ui/core/Button";

import axios from "axios";
import PodcastCardRows from "components/Content/PodcastCardRows.js";

import "assets/css/Landing.css"
const drawerWidth = 140;
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  textPrimary: {
    width:'100%',
    fontSize:"12px",
    color:"#999"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position:"relative",
    height:"100px",
    zIndex:0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

export default function Genres({}){
    const classes = useStyles()
    const [error, setError] = useState("")
    const [genres, setGenres] = useState([])
    const [genreName, setGenreName] = useState("")
    const [genreIndex, setGenreIndex] = useState(0)
    const [podcastRows, setPodcastRows] = useState([])
    const [showList, setShowList] = useState(true)

    const genre_url = localStorage.getItem("__APIROOT_URL__").concat("podcasts/get_categories")
    const podcast_by_genre_url = localStorage.getItem("__APIROOT_URL__").concat('podcasts/podcast_by_genre')
    const [finalURL, setFinalURL] = useState(podcast_by_genre_url.concat(`?category=${genreName}`))
    
    useEffect(()=>{
        /**
            Any time genre index changes. Or load amount changes
            set
        */
        let genre_uri = encodeURIComponent(genreName);
        setFinalURL(podcast_by_genre_url.concat(`?category=${genre_uri}`))

    },[genreName])

    
    useEffect(()=>{
        /**
            On first mounted, get the genre names
        */
        var mounted = true;
        axios({
          method: 'get',
          url: genre_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          }
      }).then(response => {
         //console.log(response.data)
         if(mounted){
            if(response.data){
                setGenres(response.data)
            }else{
                setError("Something went wrong. Please try again later")
            }
            
         }
         
      }).catch(error => {
            if(mounted){
                if(error.response && error.response.detail){
                    setError(error.response.detail)
                }else{
                    setError("Something bad happened. Please come again later")
                } 
            }
      })      

        return () => mounted = false;
    },[])

    const toggleDrawer = (event) => {
        event.preventDefault()
        setShowList(!showList)
    }

    const listButton = (event) => {
        event.preventDefault()
    }


    const handleListItemClick = (event, index, value) => {
        event.preventDefault()
        setGenreIndex(index)
        setGenreName(value)
    }

    return (
        <>
            {error != ""
                ? <Alert severity="error">{error}</Alert>
                : null
            }
          
          <IconButton onClick={toggleDrawer}>
            <h6> Genres </h6>
            {showList 
                ? <ChevronLeftIcon />
                : <ChevronRightIcon />
            }
          </IconButton>
            
            <Grid container>    
            
            <Slide direction="right" in={showList} mountOnEnter unmountOnExit>
            <Grid item xs={5} md={2} lg={1} style={{minHeight: "90vh", overflowY: 'auto', overflowX:'hidden'}}>
                
                <List component="nav" className={classes.drawer} aria-label="category-select">
                    {genres.map((genre, i)=>(
                         <ListItem
                            key={genre.name}
                            button
                            selected={genreIndex === i}
                            onClick={(event) => handleListItemClick(event, i, genre.name)}
                            >
                                <ListItemText classes={{primary: classes.textPrimary}} primary={genre.name} />
                            </ListItem>
                        ))}
                </List>
            </Grid>
            </Slide>
                        

            <Grid item xs={showList ? 7 : 12} md={showList ? 10 : 12} lg={showList ? 11:12}>
                <PodcastCardRows 
                    url={finalURL}
                    name="genre"
                    display_title={`${genreName}`}
                />                
            </Grid>
        </Grid>
        </>
        )

}