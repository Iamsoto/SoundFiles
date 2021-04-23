import React, { useState ,useEffect }  from 'react';
import Button from '@material-ui/core/Button';

import SubscriptionPodcast from "components/Content/SubscriptionPodcast.js";
import SubscriptionPlaylist from "components/Content/SubscriptionPlaylist.js";

import "assets/css/Landing.css"
export default function SubscriptionCard({subscription}){

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


    return (
            <>
               {(subscription.sub_type === "podcast") && (subscription.podcast != undefined)
                ? <SubscriptionPodcast podcast={subscription.podcast} no_see={subscription.no_see} sub_pk={subscription.pk}/> 
                : null
               }

               {(subscription.sub_type === "playlist") && (subscription.playlist != undefined)
                ?<SubscriptionPlaylist playlist={subscription.playlist} no_see={subscription.no_see} sub_pk={subscription.pk}/>
                :null
               }

            </>
        );
}