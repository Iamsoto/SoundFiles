import React, { useState, useEffect } from "react";
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";

import PlaylistCards from 'components/Content/PlaylistCards.js';
import axios from 'axios';
import "assets/css/SearchView.css"
import "assets/css/Landing.css"

export default function PlaylistCardRows({url, name, display_title}){  
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
            if (data.length > 100){
                return () => {mounted = false;}
            }
            if(data && data.length < loadAmount){
                setSeeMore(false);
            }
            if(data){
                setRows(data);
            }
            
            
        }).catch((error) => {
            console.log(error)
            setError("Something bad happened here. Please come back later");
        });
        return () => {mounted = false;}
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
                    <PlaylistCards 
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

        else{// Rows.length == 0
            return (<h6>Nothing here...</h6>)
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