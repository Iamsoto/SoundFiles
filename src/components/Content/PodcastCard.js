import React, { useState ,useEffect }  from 'react';
import Button from '@material-ui/core/Button';


import PodcastLandingFeature from 'components/Content/PodcastLandingFeature.js';
import loadingImg from 'assets/img/img_not_available.png';
import "assets/css/Landing.css"
export default function PodcastCard({podcast}){
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
                            src={loadingImg}
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