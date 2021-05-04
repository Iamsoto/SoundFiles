import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Slide from '@material-ui/core/Slide';
// core components
import styles from "assets/jss/material-kit-react/components/parallaxStyle.js";

const useStyles = makeStyles(styles);

export default function Parallax(props) {
  const images = [require("assets/img/soundfiles_pink.jpg"), 
  require("assets/img/soundfiles_brown.jpg")]
  const words = ["A podcast player with community", 
  "A podcast player with community", "Subscribe to your favorite podcasts! Make playlists! join the conversation!",
  "Subscribe to your favorite podcasts! Make playlists! Join the conversation!", "Enjoy the fun!", "Enjoy the fun!"]
  const words2 = ["Welcome to SoundFiles.fm", "Version Alpha"]
  const [index, setIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  let windowScrollTop;
  if (window.innerWidth >= 768) {
    windowScrollTop = window.pageYOffset / 3;
  } else {
    windowScrollTop = 0;
  }
  const [transform, setTransform] = React.useState(
    "translate3d(0," + windowScrollTop + "px,0)"
  );

  useEffect(() => {
    let index_temp = 0
    const interval = setInterval(() => {

      setIndex(index_temp ++)
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let word_temp = 0
    const interval = setInterval(() => {

      setWordIndex(word_temp ++)
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      window.addEventListener("scroll", resetTransform);
    }
    return function cleanup() {
      if (window.innerWidth >= 768) {
        window.removeEventListener("scroll", resetTransform);
      }
    };
  });
  const resetTransform = () => {
    var windowScrollTop = window.pageYOffset / 3;
    setTransform("translate3d(0," + windowScrollTop + "px,0)");
  };

  const { filter, className, children, style, image, small } = props;
  const classes = useStyles();
  const parallaxClasses = classNames({
    [classes.parallax]: true,
    [classes.filter]: filter,
    [classes.small]: small,
    [className]: className !== undefined
  });
  return (
    <div
      className={parallaxClasses}
      style={{
        ...style,
        backgroundImage: "url(" + images[index%images.length] + ")",
        transform: transform
      }}
    >
       <Slide direction="up" in={true} timeout={1300}>
           <div className="landing-big-title">
                {words2[index%words2.length]}
           </div>
       </Slide>
       <Slide direction={"right"} in={Boolean(wordIndex % 2 == 0)} timeout={1000}>
           <div className="landing-big-title-2">
                {words[wordIndex%words.length]}
           </div>
       </Slide>
    </div>
  );
}

Parallax.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  image: PropTypes.string,
  small: PropTypes.bool
};
