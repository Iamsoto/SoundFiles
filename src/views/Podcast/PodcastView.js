import React,  { useState, useEffect, useContext }  from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import { LoginContext } from 'auth/LoginContext.js';


import Share from "components/Share/Share.js";
import Flag from "components/Flag/Flag.js";
import GetValidToken from 'auth/GetValidToken';
import GetAuthHeader from 'auth/GetAuthHeader';
import Small from "components/Typography/Small.js";
import NavPills from "components/NavPills/NavPills.js";

import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import ShowMoreText from 'react-show-more-text';
import classNames from "classnames";
import axios from 'axios';

import SubscribeButton from "components/Subscribe/SubscribeButton.js"
import PodcastLike from "components/Likes/PodcastLike.js"
import Episodes from "views/Podcast/Episodes.js"

import styles from "assets/jss/Soundhub/SoundhubViewStyle.js";
import "assets/css/PodcastStyle.css";

const useStyle = makeStyles(styles);

export default function PodcastView(props) {
    const classes = useStyle();
    
    const imageClasses = classNames(
      classes.imgFluid,
      classes.imgRoundedCircle
    );
    
    const { pk } = useParams();
    const [error, setError] = useState('');
    const [podcast, setPodcast] = useState({});
    const [userSubbed, setUserSubbed] = useState(false)

    const [redirect, setRedirect] = useState(false);
    const [activeGrid, setActiveGrid] = useState(0);
    const [successOpen, setSuccessOpen] = useState(true);
    const [numLikes, setNumLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userFlagged, setUserFlagged] = useState(false);
    const { loggedIn,  setLoggedIn } = useContext(LoginContext);
    const soundhub_url = localStorage.getItem("__APIROOT_URL__").concat(`podcasts/${pk}`);

    const toggleGridList = (active) => {
      // Toggle the grid list to display
      setActiveGrid(active); // Starts at 0
    }

    const setItem = (data) => {
         var obj = {}
         obj["name"] = data.name;
         obj["rss_feed"]=data.rss_feed;
         obj["description"]=data.description;
         obj["image_url"]=data.image_url;
         obj["author"]=data.author;
         setPodcast(obj);
    }

    useEffect(() => {

      GetValidToken().then(() => {
        axios({
          method: 'get',
          url: soundhub_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization':GetAuthHeader(),
          },   
        }).then((response) => {
         // populate podcast object
            if(response.data){
                setItem(response.data);
                setNumLikes(response.data.num_likes)
                setUserLiked(response.data.cur_user_liked)
                setUserFlagged(response.data.cur_user_flagged)
                setUserSubbed(response.data.cur_user_sub)
            }

        }).catch((error) => {
            // Something happened...

              setError("Nothing to see here");
              setRedirect(true);        

        });
      }).catch(msg => {
        // Authentication error. Anonymous request
        axios({
          method: 'get',
          url: soundhub_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          },   
        }).then((response) => {
         // populate podcast object

            setItem(response.data);
            setNumLikes(response.data.num_likes)
            setUserLiked(response.data.cur_user_liked)
            setUserFlagged(response.data.cur_user_flagged)
            setUserSubbed(response.data.cur_user_sub)

        }).catch((error) => {
            // Something happened...
              setError("Nothing to see here");
              setRedirect(true);        
        });
      })


    }, []);

    if(redirect){
      // Redirect to homepage if can't view this
      return (<Redirect  to="/" />);
    };

    const closeSuccess = (event) => {
      // Close the success message
      localStorage.removeItem("success",)
      setSuccessOpen(false);
    }

    return (
      <div>
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            {(localStorage.getItem("success") != null && successOpen) ? 
            <Alert 
              severity="success"> 
              {localStorage.getItem("success")}
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={closeSuccess}
              >
                <CloseIcon />
              </IconButton>
            </Alert> : null}
            
            {error !== '' ?
            <Alert severity = "error"> {error} </Alert> : null}
          </Grid>
          
          <Grid item xs={12}>
            <Slide direction="down" in={true} timeout={500} mountOnEnter unmountOnExit>
              <div className={classNames(classes.main, classes.mainRaised)}>
                
                <div className ="podcast-row">
                <Share left={true}/>
                  {loggedIn 
                    ? <div className="podcast-right">
                        <Flag 
                          podcast_pk ={pk} 
                          user_flagged = {userFlagged}
                          reasons={["Broken link", "Private content or copyright infringement", "Inciting violence toward other(s)"]}
                        />
                      </div>
                  : null
                  }
                  </div>
                      <div className={classes.profile}>
                        <img src={podcast.image_url} alt="..." className={imageClasses} />
                        <SubscribeButton 
                          userSubbed={userSubbed}
                          setUserSubbed={setUserSubbed}
                          numSubs={podcast.num_subs}
                          podcast_pk={pk}/>
                    </div>
                    

                <div className="podcast-row">
                  <div className={classes.title}>
                    <h3>{podcast.name}</h3>
                    <h6>By:{podcast.author}</h6>
                  </div>
                  <div className="podcast-column">
                    <PodcastLike numLikes={numLikes} 
                      setNumLikes={setNumLikes}
                      userLiked={userLiked}
                      setUserLiked={setUserLiked}
                      podcast_pk={pk}/>
                    
                    <div className="podcast-rss">
                      <a href ={podcast.rss_feed}> 
                        <Small>Original Feed</Small>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Slide>
          </Grid>

          <Grid item xs={12} md={8}> 
              <ShowMoreText
                  /* Default options */
                  lines={2}
                  more='more'
                  less='less'
                  className="podcast-description-wrapper"
                  expanded={false}
               >                  
                {podcast.description}
                  
              </ShowMoreText>
          </Grid>

          <Grid item xs={12} md={12}>
            <NavPills
              color="primary"
              customChangeHandler={toggleGridList}
              tabs={[
                {
                  tabButton: "Episodes",
                  tabIcon: MovieFilterIcon,

                },
                {
                  tabButton: "Posts",
                  tabIcon: ChatIcon,

                },
              ]}
            />
          </Grid>
        </Grid>

        <hr/>

        <Grid container className={classes.container}>
          <Grid item xs={12} pr={4} pl={4}>
            {activeGrid === 0 ? <Episodes image_url = {podcast.image_url}/> : <h1> In development! </h1>}
          </Grid>
        </Grid>
      
    </div>
  );
}