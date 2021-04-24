import React, { useState, useEffect } from 'react'
import loadingImg from 'assets/img/img_not_available.png';
import 'assets/css/PlaylistsPage.css';

export default function Image({image}){
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
        <div className={loaded ? "playlist-hidden" : "playlist-show"}>
          {onMobile 
            ? <img
            className="playlist-image-small"
            src={loadingImg} />
            : <img
            className="playlist-image"
            src={loadingImg} />
          }            
        </div>

        <div className={loaded ? "playlist-show" : "playlist-hidden"}>
          {onMobile 
            ? <img
            className="playlist-image-small"
            src={image} 
            onLoad={handleImageLoaded}
            />
            : <img
            className="playlist-image"
            src={image}
            onLoad={handleImageLoaded} 
            />
          }
        </div>
        </>
        )
}