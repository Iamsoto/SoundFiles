/*eslint-disable*/
import React, { useContext, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import TextsmsIcon from '@material-ui/icons/Textsms';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';
import Badge from '@material-ui/core/Badge';

import { useHistory } from "react-router-dom";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { AudioPlayerContext } from "components/AudioPlayer/AudioPlayerContext.js";
import { LoginContext } from "auth/LoginContext.js"
import Logout from "auth/Logout.js"

const useStyles = makeStyles(styles);

export default function HeaderLinks({playlists, onClose, notificationCount, subCount}) {
  const classes = useStyles();
  let history = useHistory();
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const { setCurPlaylist, curPlaylist, 
    trackIndex, setTrackIndex } = useContext(AudioPlayerContext);

  const set_login_state = () =>{
    setLoggedIn(false)
  }

  const goLogin = (e) =>{
    e.preventDefault()
    history.push("/login")
    onClose()
  }

  const goSingup = (e) => {
    e.preventDefault()
    history.push("/register")
    onClose()
  }

  const goSocial = (e) =>{
    e.preventDefault()
    history.push("/social")
    onClose()
  }

  const logoutFunc = (e) =>{
    Logout(set_login_state, onClose)
    history.push("/goodbye")
    onClose()
  }

  useEffect(()=>{
    //console.log(playlists)
  })

  const clickPlaylist = (e, pk) => {
    e.preventDefault()
    history.push("/playlist/".concat(pk))
    onClose()
  }

  const goAccount = (e) =>{
    e.preventDefault()
    history.push("/account")
    onClose()
  }

  const goSubscription = (e) => {
    e.preventDefault()
    history.push("/subscription")
    onClose()
  }

  const userLinks = () => {
    return (
      
      <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          href=""
          color="transparent"
          onClick={goSubscription}
          className={classes.navLink}
        >
          <SubscriptionsIcon style={{margin:"0px", padding:"0px"}} className={classes.icons} />
          {subCount > 0
          ?  <Badge badgeContent={subCount} color="secondary">
              <>Subscriptions</>
            </Badge>
          : <>Subscriptions</>
          }
        </Button>
      </ListItem>

      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Playlists"
          onClick={onClose}
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={PlaylistPlayIcon}
          dropdownList={playlists.map(x=>{
            return (
              (curPlaylist.length > 0 && curPlaylist[0].playlist_pk == x.pk) 
              ? <> 
                    <Button style={{background:"transparent", color:"#000", width:"100%"}} onClick={e=>clickPlaylist(e, x.pk)}>
                    <SurroundSoundIcon style={{color:"green"}}/> {x.name}
                    </Button>
                </>
              : <Button style={{background:"transparent", color:"#000", width:"100%"}} onClick={e=>clickPlaylist(e, x.pk)}>
                  {x.name}
                </Button>
              )
            })}
        />
      </ListItem>

      <ListItem className={classes.listItem}>
        <Button
          href=""
          color="transparent"
          onClick={goSocial}
          className={classes.navLink}
        >
          <TextsmsIcon className={classes.icons} style={{margin:"0px", padding:"0px"}}/>
            {notificationCount > 0  
            ? <Badge badgeContent={notificationCount} color="error"> 
               <> Social</>
              </Badge>
            : <>Social</>
            }
        </Button>
      </ListItem>

      <ListItem 
        className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={goAccount}
        >
          <AccountCircleIcon className={classes.icons} style={{margin:"0px", padding:"0px"}}/> Account
        </Button>
      </ListItem>

      <ListItem 
        className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={logoutFunc}
        >
          <ExitToAppIcon className={classes.icons} style={{margin:"0px", padding:"0px"}}/> Logout
        </Button>
      </ListItem>
      </List>
      )
  }

  const anonLinks = () => {
    return (
      <>
      <ListItem 
        className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={goLogin}
        >
            Login
        </Button>
      </ListItem>
      <ListItem 
        className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={goSingup}
        >
          Signup (For Free!)
          
        </Button>
      </ListItem>
      </>
      )
  }


  return (
    <List className={classes.list}>
      {loggedIn ? userLinks() : anonLinks()}
    </List>
  );
}
