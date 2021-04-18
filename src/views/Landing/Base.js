import React, { useState, useEffect, useContext } from "react";
import PodcastCards from 'components/Landing/PodcastCards.js';
import EpisodeCards from 'components/Landing/EpisodeCards.js';

import 'assets/css/Landing.css';
/*
    For more information on ScrollMenu: 
        https://www.npmjs.com/package/react-horizontal-scrolling-menu
*/

export default function Base({rows, name, load_amount=6, episode=false}){

    return (
        <>
        {!episode
            ? <PodcastCards 
                items={rows}
                row_name={name}
                load_amount={load_amount}/>

            : <EpisodeCards
                items={rows}
                row_name={name}/> 
        }
        </>

    )
}