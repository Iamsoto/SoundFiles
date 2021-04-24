import React, { useState, useEffect } from 'react'

import 'assets/css/AudioPlayer.css';
import loadingImg from 'assets/img/img_not_available.png';

export default function AudioImage({image}){
    const [onMobile, setOnMobile] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const handleImageLoaded = ()=> {
        setLoaded(true)
    }

    const mobileSetter = () => {
      if(window.innerWidth <= 600){
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
        <div className={loaded ? "audio-hidden" : "audio-show"}>
          {onMobile 
            ? <img
            className="audio-image-small"
            src={loadingImg} />
            : <img
            className="audio-image"
            src={loadingImg} />
          }            
        </div>

        <div className={loaded ? "audio-show" : "audio-hidden"}>
          {onMobile 
            ? <img
            className="audio-image-small"
            src={image} 
            onLoad={handleImageLoaded}
            />
            : <img
            className="audio-image"
            src={image}
            onLoad={handleImageLoaded} 
            />
          }
        </div>
        </>
        )
}