import React, { useEffect , useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import GetAuthHeader from 'auth/GetAuthHeader';
import GetValidToken from 'auth/GetValidToken';
import { LikeContext } from 'components/Likes/LikeContext.js';
import { LoginContext } from 'auth/LoginContext.js';
import EpisodeCommentLike from "components/Likes/EpisodeCommentLike.js"

import "assets/css/Comments.css"

import axios from 'axios';

const useStyles = makeStyles((theme) => ({

      textField: {
        margin:0,
        width:"100%",
        display:'flex',
        fontSize:'12px',

      }
}));
var max_chars = 254
export default function CreateReply({comment_pk, render, setRender, replyCount}){
    const [show, setShow] = useState(false);
    const [text, setText] = useState("");
    const [remaining, setRemaining] = useState(max_chars);
    const [onMobile, setOnMobile] = useState(false);
    const { loggedIn, setLoggedIn } = useContext(LoginContext)
    const {numLikes, setNumLikes, userLiked, setUserLiked} = useContext(LikeContext)
    const [error, setError] = useState("");

    const classes = useStyles();
    const episode_comment_reply_create_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comment_reply_create`)

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


    const inputChange = (e) => {
        e.preventDefault()
        if(remaining >0 || e.target.value.length < text.length){
          setText(e.target.value)
          setRemaining(max_chars - e.target.value.length)
        }else{

        }             
    }

    const onSubmit = (e) => {
      e.preventDefault()
      if(text.length<1){
        return;
      }
      const comment_data = {text:text}
        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: episode_comment_reply_create_url,
                headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'Authorization': GetAuthHeader()
                },
                data:{
                'comment_pk':comment_pk,
                'comment_data':comment_data
                }
            }).then((response) => {
                if(response.data){
                    //Re-render the comments on submission
                    setRender(!render)
                    setText("")
                    setRemaining(max_chars)
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

    const startReply = (e) => {
        e.preventDefault();
        setShow(!show);
    }

    return(
        <>
          
          <div className="episode-comment-row">
            {error != "" ? <Alert severity="error">{error}</Alert>: null}
            {show  
            ? <form onSubmit={e => { e.preventDefault(); }}>   
                <TextField
                      id={`episode-comment-reply-id-${comment_pk}`}
                      value={text}
                      onChange = {inputChange}
                      placeholder="Reply!!"
                      margin="dense"
                      fullWidth
                      style={{height: 15 }}
                      InputProps={onMobile 
                        ?{ style: { margin:'5px', fontSize: '12px', padding:'0px' } }
                        :{ style: { margin:'5px', fontSize: '16px', padding:'0px' } }
                        }
                    />
              </form>
            : null
            }
          </div>

          <div className="episode-reply-margin-wrapper">
            <div className="episode-comment-small">
              {remaining != max_chars
                ? <>{remaining} characters left</>
                : null
                }
            </div>

            <EpisodeCommentLike 
              numLikes = {numLikes} 
              setNumLikes={setNumLikes}
              userLiked={userLiked}
              setUserLiked={setUserLiked}
              comment_pk={comment_pk}
            />

            {loggedIn ? 
            <Button 
              color="inherit"
              onClick={startReply}
              size="small"
              style={{fontSize:"10px"}}
              >
              {show ? <>Hide</> : <>Reply</>}
            </Button>
            : null
            }
            
            {show
            ? <Button 
              color="inherit"
              onClick={onSubmit}
              style={{fontSize:"10px"}}
              size="small"
              >
              Submit
            </Button>
            :null
            }
          </div>
          <div className="episode-reply-count">
            Replies: <>{replyCount}</>
          </div>


        </>
        
        )
}