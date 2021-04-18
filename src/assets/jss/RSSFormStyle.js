import { container } from "assets/jss/material-kit-react.js";

const RSSFormStyle = {
  container: {
    ...container,
    zIndex: "2",
    position: "relative",
    paddingTop: "20vh",
    color: "#FFFFFF",
    paddingBottom: "200px"
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
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center"
  },
  form: {
    margin: "0"
  },
  RSSInput: {
    marginTop: "1rem",
    textAlign: "center",
    padding: "0"
  },

};

export default RSSFormStyle;