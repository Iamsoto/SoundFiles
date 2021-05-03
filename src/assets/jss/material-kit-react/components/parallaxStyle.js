const parallaxStyle = {
  parallax: {
    height: "90vh",
    maxHeight: "1000px",
    maxWidth:"100%",
    position: "relative",
    overflow:"hidden",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    marginBottom: "10px",
    paddingBottom: "5px",
    border: "0",
    display: "flex",
    alignItems: "center",
      boxShadow:
        "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(156, 39, 176, 0.4)"

  },

  filter: {
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)"
    },
    "&:after,&:before": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''"
    }
  },
  small: {
    height: "380px"
  }
};

export default parallaxStyle;
