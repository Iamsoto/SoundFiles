import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

export default function Likes({numLikes, userLiked, onClick}){
    /**
        Base function for Likes
    */
    const [onMobile, setOnMobile] = useState(false);
    
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

    return(
            <IconButton onClick={onClick}>
              <ThumbUpAltIcon 
                style={onMobile ? {fontSize:"20px"} : {fontSize:"25px"}}
                color={userLiked? "primary": "inherit"}/>
                {numLikes > 0? numLikes: null}
            </IconButton>       
        )
}