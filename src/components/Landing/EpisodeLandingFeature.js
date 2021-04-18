import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom'

import "assets/css/Landing.css"

export default function EpisodeLandingFeature({title, time, pk}){
    const [onMobile, setOnMobile] = useState(true)
    let history = useHistory()

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

    const goPodcast = (e) => {
        e.preventDefault()
        history.push(`/episode/${pk}`)
    }

    return(
        <div className={onMobile ? 'landing-feature-mobile' : 'landing-feature'}>
            <div className="landing-feature-row">
                <div className={ onMobile ? "landing-feature-title-mobile" : "landing-feature-title"}>
                    {title}
                </div>
            </div>
            <div className="landing-feature-row">
                <div className={onMobile ? "landing-feature-text-mobile" : "landing-feature-text"}>
                    Saved location: {time}
                </div>
            </div>

            <div className="landing-feature-row">
                <div className={onMobile ? "landing-feature-text-mobile" : "landing-feature-text"}>
                    Placeholder
                </div>
            </div>
            <div className="landing-feature-row">
                <div className="landing-feature-go">
                    <Button 
                        variant="outlined"
                        size="small"
                        style={{backgroundColor:"#FFF"}}
                        onClick={goPodcast}>Go
                    </Button>
                </div>
            </div>
        </div>  
        )
}