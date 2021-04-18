import React, { useState ,useEffect }  from 'react';
import Button from '@material-ui/core/Button';

import { convertSeconds } from 'utils/Utils.js';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import EpisodeLandingFeature from 'components/Landing/EpisodeLandingFeature.js'

import "assets/css/Landing.css"
export default function EpisodeCard({episode}){
    /**
        Inspired by: 
            https://github.com/karlhadwen/netflix/blob/master/src/components/card/index.js

        Using public url: 
            https://stackoverflow.com/questions/47196800/reactjs-and-images-in-public-folder
    */
    const [loaded, setLoaded] = useState(false)
    const [showFeature, setShowFeature] = useState(false)
    const [onMobile, setOnMobile] = useState(false)
    
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


    const handleImageLoaded = ()=> {
        setLoaded(true)
    }

    return (
            <>
                <div className={loaded ? 'landing-hidden': 'landing-show'}>
                    <div className={onMobile ? 'landing-item-mobile' : 'landing-item'}
                        onClick={e => setShowFeature(!showFeature)}
                        >
                        <img 
                            src={process.env.PUBLIC_URL + '/sound_files_loading.png'}
                            alt={episode.name}
                            className="landing-img"
                        />
                        {(!onMobile) || showFeature
                            ? <EpisodeLandingFeature title ={episode.name} time={convertSeconds(episode.time)}  pk={episode.pk}/>
                            : null
                        }
                    </div>
                </div>

                <div className={loaded ? 'landing-show': 'landing-hidden'}>
                    <div className={onMobile ? 'landing-item-mobile' : 'landing-item'}
                        onClick={e => setShowFeature(!showFeature)}
                        >
                            <img 
                                src={episode.podcast.image_url}
                                alt={episode.title}
                                className="landing-img"
                                onLoad={handleImageLoaded}
                            />
                        {!onMobile || showFeature
                            ? <EpisodeLandingFeature title ={episode.name} time={convertSeconds(episode.time)}  pk={episode.pk}/>
                            : null
                        }
                    </div>
                </div>

            </>
        );
}