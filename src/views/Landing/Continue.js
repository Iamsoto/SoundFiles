import React, {useState, useEffect} from 'react';

import Alert from '@material-ui/lab/Alert';
import EpisodeCards from 'components/Content/EpisodeCards.js';

import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from 'auth/GetAuthHeader.js';

import axios from 'axios'

export default function Continue({}){
    const continue_listening_url = localStorage.getItem("__APIROOT_URL__").concat("userfeatures/episode_save_point")
    const [error, setError] = useState("")
    const [episodes, setEpisodes] = useState([])
    const [dontRender, setDontRender] = useState(false) 

    useEffect(()=>{
        GetValidToken().then((response) => {
            axios({
                method: 'get',
                url: continue_listening_url,
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*',
                    'Authorization': GetAuthHeader()
                }
            }).then(response => {
                if(response.data ){
                    if(response.data.length === 0){
                        setDontRender(true) // Don't render if there are no episodes

                    }else{
                        let temp_ep_list = response.data.map(item => {
                            let episode = item.episode;
                            let time = item.time
                            episode.time = time
                            return episode
                        })
                        //console.log(temp_ep_list)
                        setEpisodes(temp_ep_list)
                    }
                }else{
                    setDontRender(true)
                }
          
            }).catch(error => {

                setError("Something went wrong, please try again")
                setDontRender(true)
            })            
        }).catch(msg =>{
            setError("Please log in again...")
            setDontRender(true)
        })

    },[])
    
    if(dontRender){
        return null
    }

    return (
        <>
         <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title">Continue Listening...</div>
            </div>                          
            <EpisodeCards
                items={episodes}
                row_name={"Continue Listening..."}
                load_amount={6}/>
          </div>
            
        </>
        )
}