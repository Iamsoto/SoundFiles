import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useParams } from "react-router";
import Alert from '@material-ui/lab/Alert';

import GetValidToken from "auth/GetValidToken.js"
import GetAuthHeader from "auth/GetAuthHeader.js"

import axios from "axios";

import "assets/css/EpisodePage.css";

const useStyles = makeStyles((theme) => ({

      commentButtonLarge:{
        display:'flex',
        padding:10,
        flex:2,
        margin: theme.spacing(1)
      },
      commentButtonSmall:{
        fontSize:"12px",
      },

      resize:{
        fontSize:"12px",
      }
}));

const max_chars = 254
export default function CreateEpisodeComment({render, setRender}){
    /**
        Input a new Comment with this function!
    */
    
    const [text, setText] = useState("")
    const [rows, setRows] = useState(1)
    const [commentData, setCommentData] = useState({})
    const [error, setError] = useState("")
    const [charsRemaining, setCharsRemaining] = useState(max_chars)
    const [onMobile, setOnMobile] = useState(false);
    const { pk } = useParams()
    const episode_comment_create_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comment_root_create`)
    
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


    const inputChange = (e) =>{
        e.preventDefault()
        if(charsRemaining > 0 || e.target.value.length < text.length) {
            setText(e.target.value)
            setCharsRemaining(max_chars - e.target.value.length)
        }
    }

    const onSubmit = (e) => {
        /**
            TODO: timestamp
        */
        e.preventDefault()

        if(text.length <= 0){
            return;
        }
        var comment_data = {text:text, time_stamp:0}
        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: episode_comment_create_url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
                },
                data:{
                'episode_pk':pk,
                'comment_data':comment_data
                }
            }).then((response) => {
                if(response.data){
                    //Re-render the comments on submission
                    setRender(!render)
                    setText("")
                    setError("")
                    setCharsRemaining(max_chars)
                }

            }).catch((error) =>{
                console.log(error)
                if(error.response && error.response.data && error.response.data.detail){
                  setError(error.response.data.detail);
                }else{
                  setError("Something went wrong. Please try again later")
                }
            })
        }).catch((msg)=>{
            //Authentication Error
            if(msg){
               setError(msg) 
           }else{
                setError(msg);
           } 
        });
    }

    const classes = useStyles()

    return(
        <div className="episode-page-create-comment">
            {error != "" ?<Alert severity="error">{error}</Alert>: null}
            {charsRemaining < max_chars ? <div className="episode-page-time-stamp">{charsRemaining} characters remaining</div>: null}
            {text.length > 0 ? <div className="episode-page-time-stamp">Current timestamp: 00:00:00</div>: null }            
              <form className={classes.root} onSubmit={e => { e.preventDefault(); }}>
                  <TextField
                    id="episode-comment-id"
                    value={text}
                    onChange = {inputChange}
                    InputProps={onMobile ?{
                        classes: {
                          input: classes.resize,
                        },
                    }: null
                    }
                    placeholder="Post a Comment!"
                    fullWidth
                    rows={rows}
                    margin="dense"
                    multiline={true}
                    variant="outlined"
                    onFocus={()=>setRows(4)}
                  />
                {text != ""
              ? <Button type="submit" 
                    className={onMobile? classes.commentButtonSmall : classes.commentButtonLarge} 
                    onClick={onSubmit} color="primary">
                  Submit
                </Button>
              :null }

            </form>
            
        </div>
        )
}