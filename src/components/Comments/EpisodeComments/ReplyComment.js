import React, { useState, useEffect } from 'react'
import EpisodeCommentLike from 'components/Likes/EpisodeCommentLike.js';

import { convertDate } from "utils/Utils.js";

import Flag from "components/Flag/Flag.js";

import "assets/css/EpisodePage.css";
import "assets/css/Comments.css";

export default function ReplyCommentList({text, post_date, username, num_likes, cur_user_liked, cur_user_flagged, comment_pk}){
    const [onMobile, setOnMobile] = useState(false)
    const [numLikes, setNumLikes] = useState(num_likes)
    const [userLiked, setUserLiked] = useState(cur_user_liked)

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

    return (
            <div className="episode-reply">
                <div className="episode-reply-wrapper">
                    <div className="episode-reply-name">
                        {username != undefined 
                            ? <>{username}</> 
                            : <>Hacker</> 
                            }
                    </div>
                    <div className="episode-reply-date">{convertDate(post_date)}</div>
                </div>
                <div className="episode-reply-row">
                    {onMobile 
                        ? <div className="episode-reply-text-small">{text}</div>
                        : <div className="episode-reply-text">{text}</div>
                    }
                </div>
                <div className="episode-reply-wrapper">
                    <EpisodeCommentLike
                        numLikes={numLikes}
                        setNumLikes={setNumLikes}
                        userLiked={userLiked}
                        setUserLiked={setUserLiked}
                        comment_pk={comment_pk}
                    />
                
                <div className="episode-reply-right">
                  <Flag 
                    episode_comment_pk ={comment_pk} 
                    user_flagged ={cur_user_flagged}
                    reasons={["Inciting violence toward individual(s)", "Harassment"]}
                  />                  
                </div>
              </div>
            </div>  
        )
}