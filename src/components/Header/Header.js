import React, { useState, useEffect, useContext } from "react";


// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Redirect, useHistory } from "react-router-dom";
import { LoginContext } from "auth/LoginContext.js";
import { PlaylistContext } from "views/PlaylistPage/PlaylistContext.js";
import { SearchContext } from "components/Search/SearchContext.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HomeIcon from '@material-ui/icons/Home';
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import GetValidToken from "auth/GetValidToken.js";
import GetAuthHeader from "auth/GetAuthHeader.js";
import SearchBar from 'components/Search/SearchBar.js';
import styles from "assets/jss/material-kit-react/components/headerStyle.js";
import axios from "axios";

import logo from "assets/img/logo-nobackground-200.png";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationCount, setNotificationCount] = useState(0)
  const [subCount, setSubCount] = useState(0)
  const [localPlaylists, setLocalPlaylists] = useState([])
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const { searchContent, setSearchContent, searchByValue, setSearchByValue } = useContext(SearchContext)
  const {setGlobalPlaylists, globalPlaylists, 
    playlistRerender, setPlaylistRerender} = useContext(PlaylistContext);
  let history = useHistory();
  
  const playlist_url = localStorage.getItem("__APIROOT_URL__").concat('userfeatures/playlists');
  const username_url = localStorage.getItem("__APIROOT_URL__").concat('users/username');
  const ec_notifications_unseen_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/episode_comment_notifications_unseen");
  const sub_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/subscribe_unseen");

  const checkSubscriptions = () =>{
    GetValidToken().then(response=>{
      axios({
        method:'get',
        url:sub_url,
        headers: {
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Authorization': GetAuthHeader()          
        }
      }).then(response =>{
        if(response.data && response.data.count){

          if(response.data.count != subCount){
            setSubCount(response.data.count)
          }

        }

      }).catch(error=>{

      })

    }).catch(msg=>{
      // Athentication error. Pass
    })
  }

  const checkNotifications = () => {
    GetValidToken().then(response=>{
      axios({
        method:'get',
        url:ec_notifications_unseen_url,
        headers: {
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Authorization': GetAuthHeader()
        }
      }).then(response=>{
        if(response.data && response.data.count){
          if (parseInt(response.data.count) !== notificationCount ){
            setNotificationCount(parseInt(response.data.count))
          }
        }
      }).catch(error=>{
        // Don't do anything...
      })
    }).catch(msg=>{
      // Authentication error
      // Do nothing
    })
  }

  useEffect(()=> {
    /* 
      Every 3 minutes, check to see if we have new notifications
    */
    if(!loggedIn){
      return; // Don't do anything if not logged in
    }

    checkNotifications()

    const interval = setInterval(() => {
        checkNotifications()
      
    }, 120000);

    return () => clearInterval(interval);

  },[loggedIn])

  
  useEffect(()=>{
    /**
        Check subscriptions once upon using the app
    */
    if(!loggedIn){
      return;
    }

    checkSubscriptions()

  },[loggedIn])


  useEffect(() => {
        /**
          On mount retreive current user's username
        */        
        var mounted = true;
        if(!loggedIn){
          return
        }

        GetValidToken().then(()=>{
          axios({
            method: 'get',
            url: username_url,
            headers: {
              'Content-Type':'application/json',
              'Accept':'*/*',
              'Authorization': GetAuthHeader()
            }
        }).then((response) => {
           
          if(mounted){
            if(response.data && response.data.username){
              setUsername(response.data.username)
            }else{

            }
          }
    
        }).catch((error) =>{
            /* TODO */
          //console.log(error)
        });

      }).catch((msg) =>{
        /**
          Authentication error
        */

        if(mounted){
          //TODO
        }

      });

      }, [loggedIn])


    useEffect(() => {
      /**
        On mount  retreive the list of all playlists for
          the current user, 
      */      
      var mounted = true;
        if(!loggedIn){
          return
        }      

      GetValidToken().then(()=>{
        axios({
          method: 'get',
          url: playlist_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization': GetAuthHeader()
          }
      }).then((response) => {
         
        if(mounted){
          if(response.data){
            var temp_playlists = response.data
            setGlobalPlaylists(response.data);
            setLocalPlaylists(temp_playlists.map((x)=>{
              return {pk:x.pk, name:x.name}
            }))
          }
        }
      }).catch((error) =>{
          /* TODO */

      });

    }).catch((msg) =>{
      /**
        Authentication error
      */

      if(mounted){

      }

    });

    }, [loggedIn, playlistRerender])

  
  useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };

  const { color, rightLinks, leftLinks, brand, fixed, absolute, backHistory } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });

  const goHome = (event) =>{
    setSearchContent("")
    history.push("/")
  }

  const getHeaderLinks = (onClose) => {
    /**
      Return header links
    */
    if(onClose) {
      return (<><HeaderLinks onClose={onClose} playlists={localPlaylists} notificationCount = {notificationCount} subCount={subCount}/></>)
    }

    return (<><HeaderLinks playlists={localPlaylists} notificationCount = {notificationCount} subCount={subCount}/></>)
  }

  const fakeClose = () => {

  }

  const home = <HomeIcon />

  const shortenUsername = (name) =>{
    if(name.length > 16){
      return name.substirng(0, 16)
    }else{
      return name
    }
  }

  return (
    <AppBar className={appBarClasses}>
       
         
          {loggedIn 
            ? <Button onClick={goHome} className={classes.title}>{home}<Hidden mdDown>Welcome, {shortenUsername(username)}</Hidden></Button>
            : <Button onClick={goHome} className={classes.title}>{home}<Hidden mdDown>SoundFiles.fm</Hidden></Button>
          }
        
      
      
  
    <div >
      <SearchBar />
    </div>

      <div className={classes.customNavClass}>
        <Hidden smDown implementation="css">
          {getHeaderLinks(()=>{})}
        </Hidden>
      </div>

      <div className={classes.right}>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          
          </IconButton>
        </Hidden>
      </div>

      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {getHeaderLinks(handleDrawerToggle)}
          </div>
        </Drawer>
      </Hidden>
      
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};
