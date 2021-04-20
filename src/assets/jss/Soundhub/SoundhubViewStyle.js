import { title } from "assets/jss/material-kit-react.js";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";
import globalStyles from "assets/jss/root.js";

const SoundhubViewStyle = {
  globalStyles,
  profile: {
    width:"100%",
    maxHeight:"40vh",
    textAlign: "center",
    "& img": {
      maxWidth: "300px",
      '@media (max-width: 360px)': {
          maxWidth: 150,

      },
    }
  },

  podcastColumn:{
    display: "flex",
    flexDirection:"column",
  },

  podcastSubscribe:{
    
  },


  episodeButtonsSpan:{
    display:"flex",
    justify:"end",
  },

  episodeCard:{
    width:"100%",
    paddingRight:"16px",
    paddingLeft:"16px",
    paddingBottom:"20px"
  },

  label:{
    color:"#FFFFFF"
  },
  colorPrimary:{
    color: "#999",
  },
  soundFilesformControl: {
    margin: "8px",
  },
  description: {
    color: "#999",
    textAlign: "center !important",
    whiteSpace: 'pre-wrap', 
    overflowWrap: 'break-word',
    margin:"8px"
  },
  name: {
    marginTop: "-80px"
  },
  ...imagesStyle,
  main: {
    background: 'rgba(255, 255, 255, 0.8)',
    position: "relative",
    padding:"8px"

  },
  mainRaised: {
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  episodeFilter: {
    margin: "-60px 30px 0px"
  },
  title: {
    ...title,
    whiteSpace: 'pre-wrap', 
    overflowWrap: 'break-word',
    margin:"8px",
    flex:4,

  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {

  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center"
  },
  cardHeader: {
    width: "auto",
    textAlign: "center",
    padding: "20px 0",
    marginBottom: "15px"
  },
  cardFooter: {
    paddingTop: "0rem",
    border: "0",
    borderRadius: "6px",
    justifyContent: "center !important"
  },

  content: {
    zIndex:0
  },

  backdrop: {
    zIndex: -99,
    color: '#fff',
  },
};

export default SoundhubViewStyle;
