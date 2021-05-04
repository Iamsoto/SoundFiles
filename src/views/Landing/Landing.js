import React, { useState, useEffect, useContext } from "react";
import Parallax from "components/Parallax/Parallax.js";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { LoginContext } from 'auth/LoginContext.js';
import { LandingContext } from 'views/Landing/LandingContext.js';
import Genres from 'views/Landing/Genres.js';
import Continue from 'views/Landing/Continue.js';
import CreateSoundhub from 'views/CreateSoundhub/CreateSoundhub.js';
import PodcastCardRows from 'components/Content/PodcastCardRows.js'
import Slide from '@material-ui/core/Slide';

import Playlists from 'views/Landing/Playlists.js';
import SearchBar from 'views/Landing/SearchBar.js';
import SearchView from 'views/Landing/SearchView.js';

import StyledTabs from 'components/StyledTabs/StyledTabs.js';
import StyledTab from 'components/StyledTabs/StyledTab.js';

import "assets/css/Landing.css"

import logo from "assets/img/logo-nobackground-200.png";


export default function Landing(props) {

    const [page, setPage] = useState(0);
    const [searchContent, setSearchContent] = useState('');
    const [searchByValue, setSearchByValue] = useState('title');
    const { loggedIn, setLoggedIn } = useContext(LoginContext);

    
    const setSearchContentWrapper = (value) => {
        setSearchContent(value)
    }

    const handleTabChange =(event, value) =>{
        event.preventDefault();
        setSearchContent('')
        setPage(value);
    }

    const getCurrentPage =() =>{
        if(searchContent !== ''){
            return (<SearchView input={searchContent} searchBy={searchByValue} />)
        }

        else if(page === 0){
            return (<>
                {loggedIn ? <Continue /> : null}
                <PodcastCardRows 
                    url={localStorage.getItem("__APIROOT_URL__").concat("podcasts/get_popular?q=soundfiles")}
                    name="week"
                    display_title="Popular on SoundFiles"
                    desk_rows={1}
                />
                <PodcastCardRows 
                    url={localStorage.getItem("__APIROOT_URL__").concat("podcasts/get_popular?q=global")}
                    name="month"
                    display_title="Popular Globally"
                    desk_rows={1}
                />
                </>
            )
        }
        
        else if (page === 1){
            return (<div className="landing-wrapper"><Genres /></div>)
        }
        else if (page === 2){
            return(<div className="landing-wrapper"><Playlists /></div>)
        }
        else if(page === 3){
            return (<CreateSoundhub/>)
        }
        else{
            return (<></>);
        }
    }

    return (
        <div>
           <Parallax small filter />
            
            <Grid container>
                <Grid item xs={12} md={8} xl={10}>
                    
                    <StyledTabs 
                        variant="scrollable"
                        scrollButtons='on'
                        value={page} 
                        onChange={handleTabChange }
                        aria-label="styled tabs">
                      <StyledTab label="Main" />
                      <StyledTab label="Genres" />
                      <StyledTab label="Playlists" />
                      <StyledTab label="Request a Podcast" />
                    </StyledTabs>  
                </Grid>
                
                <Grid item md={4} xl={2} mt={12}>
                    <SearchBar 
                        setSearchContent={setSearchContentWrapper}
                        searchByValue={searchByValue}
                        setSearchByValue={setSearchByValue}
                    />
                </Grid>         
            </Grid>

            <LandingContext.Provider value={{page, setPage, setSearchContent}}>
                <div className="landing-main-box">
                    {getCurrentPage()}
                </div>
            </LandingContext.Provider>
        </div>
    );

}