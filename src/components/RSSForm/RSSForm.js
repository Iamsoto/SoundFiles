import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import GetValidToken from 'auth/GetValidToken.js';
import GetAuthHeader from "auth/GetAuthHeader.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Alert from '@material-ui/lab/Alert';
import Danger from 'components/Typography/Danger.js';
import CustomInput from "components/CustomInput/CustomInput.js";
import SecondaryForm from "components/RSSForm/SecondaryForm.js";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import styles from "assets/jss/RSSFormStyle.js";
import axios from 'axios';
import 'assets/css/RssForm.css';

const useStyles = makeStyles(styles);


export default function RSSForm(props) {
    const classes = useStyles();
    const [errorMsg, setErrorMsg] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [podcastName, setPodcastName] = useState('');
    const [podcastURL, setPodcastURL] = useState('');
    const [podcastImage, setPodcastImage] = useState('');
    const [podcastDescr, setPodcastDescr] = useState('');
    const [author, setAuthor] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const xml_post_url = localStorage.getItem("__APIROOT_URL__") + 'podcasts/inspect_xml';
    const url_post_url = localStorage.getItem("__APIROOT_URL__") + 'podcasts/inspect_url';

    const handlePOSTRequest = (input, url, headers) => {
      /**
        
      */
      axios({
              method: 'post',
              url: url,
              headers: headers,          
              data: input
            }).then((response) => {
              // Set prop items, turn visible on
              var obj = response.data;
              setPodcastName(obj.title);
              setPodcastImage(obj.image);
              setPodcastURL(obj.url);
              setPodcastDescr(obj.descr);
              setAuthor(obj.author);
              setVisible(true);
              setLoading(false);
            }).catch((error) => {
              var obj = error.response.data
              if(obj.detail){
                setErrorMsg(obj.detail);
              }
            })
    }

    const callAPI = (input) =>{
        let url = '';
        let headers = {};
        let final_input = input

        GetValidToken().then(()=>{
          if (input.startsWith("http://") || input.startsWith("https://")){
            // Send url check to the server
            url = url_post_url;
            headers = {
              'Content-Type':'application/json',
              'Accept':'*/*',
              'Authorization': GetAuthHeader()
            }
            // Place url into a string
            final_input = JSON.stringify({'url':input});
          }else{
            // send xml check to the server
            url = xml_post_url;
            headers = {
              'Content-Type':'application/xml',
              'Accept':'*/*',
              'Authorization': GetAuthHeader()
            }
          }

          handlePOSTRequest(final_input, url, headers);
          
          
      }).catch((msg) => {
          //setLoggedInWrapper(msg)
          setErrorMsg(msg);
          setLoading(false);
    
      }).finally(() => {
        //setLoading(false);
      })    
    }

    const onInputChange = (e) => { 
        e.preventDefault();
          
        setErrorMsg('');
        setVisible(false);

        var input = e.target.value;
        if (input === '' || input.length < 9) {
          return null;
        }

        setLoading(true);
        callAPI(input)
    }

    const helpButtonClick = (e) => {
      e.preventDefault()
      setAnchorEl(e.currentTarget)
    }

    const handleClose = (e) => {
      e.preventDefault()
      setAnchorEl(null)
    }

    return (
          <div>
        
            <form className={classes.form} onSubmit={e => { e.preventDefault(); }}>
              <CustomInput
                labelText="Enter RSS Feed or RSS URI"
                id="rss_feed"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text",
                  autoComplete: "off"
                }}
                onChange = {onInputChange}                
              />
            </form>

            <Danger>Soundfiles only supports RSS feeds intended to be public</Danger>

          {errorMsg !== '' 
          ? <Alert severity="error">{errorMsg}</Alert> 
          : null }
            <IconButton onClick={helpButtonClick}><HelpOutlineIcon/></IconButton>
              <Menu
                id="rss-help-text"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <div className="rss-text-help">
                  If you have an RSS feed to a podcast that's meant to be public, post it here and I'll take a look at it!
                  Don't have an RSS feed? Ask the content creator
                </div>
              </Menu>        
          {loading ? <div style={{justify:"center"}}><CircularProgress color="primary"/></div> : null}

        {visible 
        ? <SecondaryForm
        name = {podcastName}
        url = {podcastURL}
        image = {podcastImage}
        descr = {podcastDescr}
        author = {author}
      /> : null}
      </div>
    );
}


