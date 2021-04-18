import React, { useState, useEffect } from 'react'

import "assets/css/EpisodePage.css";

export default function AudioImage({image}){
    const [onMobile, setOnMobile] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const handleImageLoaded = ()=> {
        setLoaded(true)
    }

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

    },[window.innerWidth])

    return(
        <>
        <div className={loaded ? "episode-page-hidden" : "episode-page-show"}>
          {onMobile 
            ? <img
            className="episode-page-image-small"
            src={process.env.PUBLIC_URL + '/sound_files_loading.png'} />
            : <img
            className="episode-page-image"
            src={process.env.PUBLIC_URL + '/sound_files_loading.png'} />
          }            
        </div>

        <div className={loaded ? "episode-page-show" : "episode-page-hidden"}>
          {onMobile 
            ? <img
            className="episode-page-image-small"
            src={image}
            onLoad={handleImageLoaded} 
            />
            : <img
            className="episode-page-image"
            src={image}
            onLoad={handleImageLoaded} 
            />
          }
        </div>
        </>
        )
}