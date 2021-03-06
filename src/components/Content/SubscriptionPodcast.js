import React, {useEffect, useState} from 'react'
import SubscriptionFeature from "components/Content/SubscriptionFeature.js";
import loadingImg from 'assets/img/img_not_available.png';
import "assets/css/Landing.css"
export default function SubscriptionPodcast({podcast, no_see, sub_pk}){
    const [loaded, setLoaded] = useState(false)
    const [showFeature, setShowFeature] = useState(false)
    const [onMobile, setOnMobile] = useState(false)
    const [podcastState, setPodcastState] = useState(podcast)

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
        if(podcast != null){
           setPodcastState(podcast) 
        }
        

    },[podcast])

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
                    {no_see ?
                        <div className="landing-no-see" ><div className="landing-no-see-text">New!</div></div>
                        : null
                    }
                <img 
                    src={loadingImg}
                    alt={podcastState.name}
                    className="landing-img"
                />
                {(!onMobile) || showFeature
                    ? <SubscriptionFeature 
                        title ={podcastState.name}
                        author={podcastState.author}
                        pk={podcastState.pk}
                        last_updated={podcastState.update_time}
                        type="podcast"
                        sub_pk={sub_pk}
                        />
                    : null
                }
            </div>
        </div>

        <div className={loaded ? 'landing-show': 'landing-hidden'}>
            <div className={onMobile ? 'landing-item-mobile' : 'landing-item'}
                onClick={e => setShowFeature(!showFeature)}
                >
                {no_see ?
                    <div className="landing-no-see" ><div className="landing-no-see-text">New!</div></div>
                    : null
                }
                    <img 
                        src={podcastState.image_url}
                        alt={podcastState.name}
                        className="landing-img"
                        onLoad={handleImageLoaded}
                    />
                {!onMobile || showFeature
                    ? <SubscriptionFeature 
                        title ={podcastState.name}
                        author={podcastState.author}
                        pk={podcastState.pk}
                        last_updated={podcastState.update_time}
                        type="podcast"
                        sub_pk={sub_pk}
                        />
                    : null
                }
            </div>
    </div>
    </>
    )
}