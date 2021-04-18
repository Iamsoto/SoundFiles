import React, {useState, useEffect, useContext} from 'react'


import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import { LoginContext } from 'auth/LoginContext.js';
import Alert from '@material-ui/lab/Alert';

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';
import ReplyComment from 'components/Comments/EpisodeComments/ReplyComment.js';
import CreateReply from "components/Comments/EpisodeComments/CreateReply.js";
import "assets/css/EpisodePage.css";
import "assets/css/Comments.css";
import axios from 'axios';

import { useParams } from "react-router";

export default function ReplyCommentList({comment_pk, render, setReplyCount}){
    const [replies, setReplies] = useState([])
    const [error,setError] = useState("")
    const [loadMore, setLoadMore] = useState(3)
    const [total, setTotal] = useState(0)
    const [onMobile, setOnMobile] = useState(false)


    const episode_comment_reply_list_url = localStorage.getItem("__APIROOT_URL__").concat(`userfeatures/episode_comment_reply_list/${comment_pk}`)
    
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
      GetValidToken().then(()=>{
        // First try with This. 
        axios({
            method: 'get',
            url: episode_comment_reply_list_url.concat(`?load_more=${loadMore}`),
            headers: {
            'Content-Type':'application/json',
            'Accept':'*/*',
            'Authorization': GetAuthHeader()
            }
        }).then((response)=>{
            if(response.data && response.data.results){
                setReplies(response.data.results)
                setTotal(response.data.count)
                setReplyCount(response.data.count)
            }

        }).catch(error=>{
            
        })

      }).catch(msg =>{
        // Authentication error, give anonymouse request
        axios({
            method: 'get',
            url: episode_comment_reply_list_url.concat(`?load_more=${loadMore}`),
            headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
            }
        }).then((response)=>{
            if(response.data && response.data.results){
                setReplies(response.data.results)
                setTotal(response.data.count)
                setReplyCount(response.data.count)
            }

        }).catch(error=>{
            
        })
      })

    },[render, loadMore])

    const clickViewMore = () => {
        setLoadMore(loadMore + 8)
    }

    return(
        <> 
          {error != "" ? <Alert severity="error">{error}</Alert> : null }
          
          {replies.map(reply => (
              <React.Fragment key={`reply-${reply.pk}-${comment_pk}`}>
                  <ReplyComment
                    text={reply.text}
                    post_date={reply.post_date}
                    username={reply.user.username}
                    comment_pk={reply.pk}
                    num_likes={reply.num_likes}
                    cur_user_liked={reply.cur_user_liked}
                    cur_user_flagged={reply.cur_user_flagged}
                  />
                  
              </React.Fragment>
          ))}

          {loadMore < total
          ? <Button 
            color="inherit"
            onClick={clickViewMore}
            style={{fontSize:"10px"}}
            size="small"
            >
            View More...
            </Button>
            : null
          }
        </>
        )


}