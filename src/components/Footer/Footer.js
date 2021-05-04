/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom';

import logo from "assets/img/logo-nobackground-200.png"
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Link to="/about" style={{ textDecoration: 'none'}} className={classes.block}>
                About
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link to="/contact" style={{ textDecoration: 'none'}} className={classes.block}>
                Contact
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link to="/privacy-policy" style={{ textDecoration: 'none'}} className={classes.block}>
                Privacy Policy
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link to="/terms-of-service" style={{ textDecoration: 'none'}} className={classes.block}>
                Terms of Service
              </Link>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>

            &copy; {1900 + new Date().getYear()}
          
            The Intro Code 

        </div>
        <img src={logo}/>        
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
