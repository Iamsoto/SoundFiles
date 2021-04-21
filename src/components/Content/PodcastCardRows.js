import React, { useState, useEffect } from "react";
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";

import PodcastCards from 'components/Content/PodcastCards.js';
import axios from 'axios'
import "assets/css/SearchView.css"

export default function PodcastCardRows({url, name, display_title}){  
    const [error, setError] = useState('');
    const [rows, setRows] = useState([]);
    const [seeMore, setSeeMore] = useState(true);
    const [loadAmount, setLoadAmount] = useState(6)
    const [onMobile, setOnMobile] = useState(false)

    const mobileSetter = () => {
        if(window.innerWidth <= 360){
            if(!onMobile){
                setOnMobile(true)
            }
                        
        }else{
            if(onMobile){
                setOnMobile(false) 
            }
        }
    }

    useEffect(()=> {
        var mounted = true;
        axios({
          method: 'get',
          url: url.concat(`&num=${loadAmount}`),
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          },   
        }).then((response) => {
            let data = response.data;
            if(data.results.length < loadAmount){
                setSeeMore(false);
            }
            setRows(data.results);
            
        }).catch((error) => {
            console.log(error);
            setError("Something bad happened here. Please come back later");
        });
        return() => {mounted = false;}
    }, [url, loadAmount])

    const numPerRow = () =>{
        return 6 // I don't feel like mathing this out
    }

    const onSeeMore = (e) =>{
        e.preventDefault();
        setLoadAmount(loadAmount + numPerRow())
    }

    const getContents =()=> {
        if(error === '' && rows.length >0){
            return (
                <>
                    <PodcastCards 
                        items={rows}
                        row_name={name}
                        load_amount={loadAmount}/>
                    <div className ="landing-row">
                    {seeMore ? <p><Button style = {{background:"transparent", color:"#999", fontSize:"12px"}} 
                                    onClick={onSeeMore}>See More...</Button>
                                </p>: null}
                    </div>
                </>)
        }

        else if( error !=='') {
            return (<Alert severity="error"> {error} </Alert>)
        }

        else{
            return (<></>)
        }
    }
    return (
        <>  
        <div className="landing-container">
            <div className="landing-row">
                <div className="landing-title">{display_title}</div>
            </div>                          
            { getContents() }
        </div>
        </>
    );
}