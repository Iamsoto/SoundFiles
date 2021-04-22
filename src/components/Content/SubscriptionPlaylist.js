import React, {useEffect, useState} from 'react'
import SubscriptionFeature from "components/Content/SubscriptionFeature.js";

import "assets/css/Landing.css"
export default function SubscriptionPlaylist({playlist}){
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
        console.log(playlistState)
        if(playlist != undefined){
            setPlaylistState(playlist)
        }
        
    },[playlist])


    return (
            <div className='landing-show'>
                <div className={onMobile ? 'landing-item-mobile' : 'landing-item'} onClick={e => setShowFeature(!showFeature)}>
                    <img 
                        src={process.env.PUBLIC_URL + '/sound_files_loading.png'}
                        className="landing-img"
                    />
                    {(!onMobile) || showFeature
                        ?
                            <SubscriptionFeature
                                title ={playlistState.name}
                                author={playlistState.user.username}
                                pk={playlistState.pk}
                                last_updated={playlistState.update_time}
                                type="playlist"/>
                            
                        : null
                    }
                </div>
            </div>

    )
}