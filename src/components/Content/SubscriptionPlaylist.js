import React, {useEffect, useState} from 'react'


export default function SubscriptionPlaylist({playlist}){
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
                ? <SubscriptionFeature 
                    title ={podcast.name}
                    author={podcast.author}
                    pk={podcast.pk}
                    last_updated={podcast.update_time}
                    type="podcast"/>
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
                ? <SubscriptionFeature 
                    title ={podcast.name}
                    author={podcast.author}
                    pk={podcast.pk}
                    last_updated={podcast.update_time}
                    type="podcast"
                    />
                : null
            }
        </div>
    </div>  
}