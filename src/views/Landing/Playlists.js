import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


import axios from "axios";
import PlaylistCardRows from "components/Content/PlaylistCardRows.js";

import "assets/css/Landing.css"

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      maxWidth: "100%",
      background:"transparent"
    },

  },

  input: {
    flex: 1,

  },

  iconButton: {
    padding: 10,
  },
}));

export default function Playlists({}){
    const classes = useStyles();
    const [error, setError] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const [rows, setRows] = useState([])
    const [showList, setShowList] = useState(true)
    const [searchBy, setSearchBy] = useState('name')
    const [loadAmount, setLoadAmount] = useState(6)
    const [seeMore, setSeeMore] = useState(false)
    const [query, setQuery] = useState("")

    const url = localStorage.getItem("__APIROOT_URL__").concat('userfeatures/playlists_popular')
    const [finalURL, setFinalURL] = useState(url)
    
    useEffect(()=>{
        /**
            On first mounted...
        */
        setFinalURL(url.concat(`?q=${query}&search_by=${searchBy}`))

    },[query,searchBy])      

    const handleClose = (e) =>{
        e.preventDefault()
        setAnchorEl(null)
    }

    const setMenu = (e) =>{
        e.preventDefault()
        setAnchorEl(e.currentTarget)
    }

    const onQueryChange = (e) => {
        e.preventDefault()
        setQuery(e.target.value)
    }

    const handleQueryChange = (e) =>{
        e.preventDefault()
        setQuery(e.target.value)
    }

    const handleSearchByChange = (e) =>{
        e.preventDefault()
        setSearchBy(e.target.value)
    }

    return (
        <>
            {error != ""
                ? <Alert severity="error">{error}</Alert>
                : null
            }
            <Grid container>
                <Grid item xs={4} md={2}>
                    <form className={classes.root} onSubmit={e => { e.preventDefault(); }} noValidate autoComplete="off">
                      <IconButton className={classes.iconButton} aria-label="menu-playlist-search" onClick={setMenu}>
                        <MenuIcon />
                      </IconButton>
                      <Menu
                          id="searchbar-id"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                      >
                      <FormControl component="fieldset" style={{margin:"10px"}}>
                        <RadioGroup aria-label="search by" name="search by form" value={searchBy} onChange={handleSearchByChange}>
                          <FormControlLabel value="name" control={<Radio />} label="Name" />
                          <FormControlLabel value="id" control={<Radio />} label="ID" />
                        </RadioGroup>
                      </FormControl>
                      </Menu>

                      <TextField
                        className={classes.input}
                        placeholder={`Search Playlists (By ${searchBy == 'id' ? 'ID' : 'Name'})`}
                        inputProps={{ 'aria-label': 'Search playlists' }}
                        onChange={onQueryChange}
                      />

                    </form>
                </Grid>
            </Grid>    
            <PlaylistCardRows 
                url={finalURL}
                name="Popular playlists"
                display_title={`Popular Playlists`}
            />          

        </>
        )

}