import React, { useState ,useEffect }  from 'react';
import Button from '@material-ui/core/Button';


import SubscriptionFeature from 'components/Content/PodcastLandingFeature.js';

import "assets/css/Landing.css"
export default function SubscriptionCard({podcast}){

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
                            alt={podcast.name}
                            className="landing-img"
                        />
                        {(!onMobile) || showFeature
                            ? <PodcastLandingFeature title ={podcast.name} num_likes={podcast.num_likes} author={podcast.author} pk={podcast.pk}/>
                            : null
                        }
                    </div>
                </div>

                <div className={loaded ? 'landing-show': 'landing-hidden'}>
                    <div className={onMobile ? 'landing-item-mobile' : 'landing-item'}
                        onClick={e => setShowFeature(!showFeature)}
                        >
                            <img 
                                src={podcast.image_url}
                                alt={podcast.name}
                                className="landing-img"
                                onLoad={handleImageLoaded}
                            />
                        {!onMobile || showFeature
                            ? <PodcastLandingFeature 
                                title ={podcast.name}
                                num_likes={podcast.num_likes}
                                author={podcast.author}
                                pk={podcast.pk}
                                num_subs={podcast.num_subs}
                                />
                            : null
                        }
                    </div>
                </div>

            </>
        );
}