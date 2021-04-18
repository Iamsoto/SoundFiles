import React, { useState, useEffect } from 'react'

import { LikeContext } from 'components/Likes/LikeContext.js';
import { convertDate } from "utils/Utils.js";
import ReplyCommentList from "components/Comments/EpisodeComments/ReplyCommentList.js";
import CreateReply from "components/Comments/EpisodeComments/CreateReply.js";
import Flag from "components/Flag/Flag.js"


export default function RootComment({username, postDate, timeStamp, text, pk, num_likes, user_liked, user_flagged}){
    const [renderReplies, setRenderReplies] = useState(false);
    const [replyCount, setReplyCount] = useState(0)
    const [onMobile, setOnMobile] = useState(0)
    const [numLikes, setNumLikes] = useState(num_likes)
    const [userLiked, setUserLiked] = useState(user_liked)
    const [userFlagged, setUserFlagged] = useState(user_flagged)
    const [commentPK, setCommentPK] = useState(pk)

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
      setNumLikes(num_likes)
      setUserLiked(user_liked)
      setUserFlagged(user_flagged)
      setCommentPK(pk)
      setRenderReplies(!renderReplies)

    }, [num_likes, user_liked, user_flagged, pk])

    useEffect(()=>{
      /**
          Hook to use on window inner width
      */
      mobileSetter()
      window.addEventListener('resize', mobileSetter );

      return () => window.removeEventListener('resize', mobileSetter);

    }, [window.innerWidth])

    return (
        <>
            <div className= "episode-comment" >
                <div className="episode-comment-wrapper">
                    <div className="episode-comment-name">{ username == null? "Hacker" : username}</div>
                    
                    <div className="episode-comment-right">
                      <div className="episode-comment-date">
                        {convertDate(postDate)}
                      </div>
                    </div>
                </div>

                <div className="episode-comment-wrapper">
                    <div className="episode-comment-time-stamp">Time Stamp: {timeStamp}</div>
                    
                    <div className="episode-comment-right">
                      <Flag 
                        episode_comment_pk ={pk} 
                        user_flagged ={userFlagged}
                        reasons={["Inciting violence toward individual(s)", "Harassment"]}
                      />
                    </div>
                </div>

                <div className="episode-comment-wrapper">
                  <div className="episode-comment-row">
                      {onMobile
                          ?<div className="episode-comment-text-small">{text}</div>
                          :<div className ="episode-comment-text">{text}</div>
                      }
                  </div>
                </div>

                <div className="episode-reply-wrapper">
                    <LikeContext.Provider value={{numLikes, setNumLikes, userLiked, setUserLiked}}>
                        <CreateReply 
                            comment_pk={pk}
                            render={renderReplies}
                            setRender={setRenderReplies}
                            replyCount={replyCount} />
                    </LikeContext.Provider>
                </div>
            </div>

            <ReplyCommentList comment_pk={commentPK} render={renderReplies} setReplyCount={setReplyCount}/>
        </>
    )   
}