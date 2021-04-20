import React, { useState, useEffect, useContext } from 'react'

import Grid from '@material-ui/core/Grid';

import Button from "@material-ui/core/Button";
import { LandingContext } from "views/Landing/LandingContext.js";

import PodcastCardRows from "views/Landing/PodcastCardRows.js";

import "assets/css/SearchView.css"


export default function SearchView({input, searchBy}){
    const searchAPIURL = localStorage.getItem("__APIROOT_URL__").concat("podcasts/search")
    const { page, setPage, setSearchContent} = useContext(LandingContext);
    const query_str = "?q=".concat(encodeURIComponent(input))
    const [finalURL, setFinalURL] = useState(searchAPIURL.concat(query_str).concat(`&search_by=${searchBy}`))

    useEffect(()=>{
        const query_str = "?q=".concat(encodeURIComponent(input))
        setFinalURL(searchAPIURL.concat(query_str).concat(`&search_by=${searchBy}`))
    }, [input, searchBy])
    
    const goPodcast = (e) => {
        setSearchContent("");
        setPage(2);
    }

    return (
        <Grid container>
            <PodcastCardRows 
                url={finalURL} 
                name="search_results"
                display_title={searchBy === 'title' ? `Titles like: ${input}` : `Authors like: ${input}`}/>
            <div className="searchview-button">
               <p> Didn't find what you were looking for?
               <Button size="small" onClick={goPodcast}> Request it!</Button></p>
            </div>
        
        </Grid>
        
    );
}

