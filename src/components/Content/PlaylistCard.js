import React, {useEffect, useState} from 'react'
import PodcastLandingFeature from "components/Content/PodcastLandingFeature.js";

import playlistImg from 'assets/img/playlist.png';
import "assets/css/Landing.css"


export default function PlaylistCard({playlist}){
    const [showFeature, setShowFeature] = useState(false)
    const [onMobile, setOnMobile] = useState(false)
    const [playlistState, setPlaylistState] = useState(playlist)    

    const mobileSetter = () => {
      /* For this component, onMobile = tablet or not */
      if(window.innerWidth <= 800){
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


    useEffect(()=>{
        if(playlist != undefined){
            setPlaylistState(playlist)
        }
        
    },[playlist])


    return (
            <div className='landing-show'>
                <div className={onMobile ? 'landing-item-mobile' : 'landing-item'} onClick={e => setShowFeature(!showFeature)}>   
                    <img 
                        src={playlistImg}
                        className="landing-img"
                    />
                    {(!onMobile) || showFeature
                        ?
                        <PodcastLandingFeature
                            title ={playlistState.name}
                            author={playlistState.user.username}
                            num_likes={playlistState.num_likes}
                            num_subs={playlistState.num_subs}
                            url={`/playlist/${playlistState.pk}`}
                            />
                            
                        : null
                    }
                </div>
            </div>

    )
}