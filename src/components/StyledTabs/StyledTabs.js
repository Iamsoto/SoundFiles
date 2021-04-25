import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

const StyledTabs = withStyles({
  root: {
  	 padding:"0px",
  	 maxHeight:"100%",
  	 maxWidth:"100%",
  },

  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#090099',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export default StyledTabs;