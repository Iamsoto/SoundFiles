import React, { useState, useContext, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { SearchContext } from 'components/Search/SearchContext.js';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '10px 10px',
    display: 'flex',
    width:'100%',
    boxShadow:'None',
    marginTop: theme.spacing(3),
    marginLeft:'auto',
    [theme.breakpoints.down('md')]: {
      maxWidth: "100%",
      background:"transparent"
    },
    [theme.breakpoints.up('md')]: {
      width: '50%',
      transition: [['width', '600ms']],
      "&:hover":{
        width:'75%',
      },
    },
  },

  input: {
    marginLeft: theme.spacing(1),
    
    marginRight: theme.spacing(1),
    width:'50vw',
    boxShadow:'None',

  },

  iconButton: {
    padding: 10,
  },
}));

export default function SearchBar() {
  const classes = useStyles();
  const location = useLocation();
  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const { searchContent, setSearchContent, searchByValue, setSearchByValue } = useContext(SearchContext)
  const [onMobile, setOnMobile] = useState(false)
  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null)
  }
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

  useEffect(()=>{
      /**
          Hook to use on window inner width
      */
      mobileSetter()
      window.addEventListener('resize', mobileSetter );

      return () => window.removeEventListener('resize', mobileSetter);

  }, [window.innerWidth, window.innerHeight])

  const handleSearchByChange = (event) => {
    setSearchByValue(event.target.value);
  };  

  const setMenu = (event) => {
      /**
        Open this component
      */
      event.preventDefault();
      setAnchorEl(event.currentTarget)
  }

  const searchInputChange = (event) =>{
    event.preventDefault()
    console.log(location.pathname);
    if(location.pathname != "/"){
      history.push("/")
    }
    setSearchContent(event.target.value)
  }

  const reset = (event) =>{
    event.preventDefault()
    setSearchContent("")
  }

  const getPlaceholder = () => {
    if (onMobile){
      return "Search Podcasts!"
    }else{
      return `Search Podcasts! (By ${searchByValue == 'title' ? 'Title' : 'Author'})`
    }
  }
  return (
    <form className={classes.root} onSubmit={e => { e.preventDefault(); }} noValidate autoComplete="off">
      <IconButton className={classes.iconButton} onClick={setMenu} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Menu
          id="searchbar-id"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
      >
        <FormControl component="fieldset" style={{margin:"10px"}}>
          <RadioGroup aria-label="search by" name="search by form" value={searchByValue} onChange={handleSearchByChange}>
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel value="author" control={<Radio />} label="Author" />
          </RadioGroup>
        </FormControl>
      </Menu>
      <TextField
        className={classes.input}
        placeholder={getPlaceholder()}
        inputProps={{ 'aria-label': 'Search SoundFiles!' }}
        variant="outlined"
        value={ searchContent }
        onChange={searchInputChange}
      />

      {searchContent !== ""
        ?<IconButton className={classes.iconButton} onClick={reset} aria-label="reset">
          <RotateLeftIcon/>
         </IconButton>
        :null
      }
    </form>
  );
}