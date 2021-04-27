import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '10px 10px',
    display: 'flex',
    boxShadow:'None',
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
    boxShadow:'None',
    flex: 1,

  },

  iconButton: {
    padding: 10,
  },
}));

export default function CustomizedInputBase({setSearchContent, searchByValue, setSearchByValue}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null)
  }

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

  return (
    <form className={classes.root} onSubmit={e => { e.preventDefault(); }} noValidate autoComplete="off">

      <IconButton className={classes.iconButton} aria-label="menu" onClick={setMenu}>
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
          <RadioGroup aria-label="search by" name="search by form" value={searchByValue} onChange={handleSearchByChange}>
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel value="author" control={<Radio />} label="Author" />
          </RadioGroup>
        </FormControl>
      </Menu>
      <TextField
        className={classes.input}
        placeholder={`Search Podcasts! (By ${searchByValue == 'title' ? 'Title' : 'Author'})`}
        inputProps={{ 'aria-label': 'Search SoundFiles!' }}
        onChange={(event)=>{setSearchContent(event.target.value) }}
      />
    </form>
  );
}