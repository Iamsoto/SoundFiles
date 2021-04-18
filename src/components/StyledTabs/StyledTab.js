import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const StyledTab = withStyles((theme) => ({
  root: {
    color: '#999',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },

    
  },
}))((props) => <Tab disableRipple {...props} />);

export default StyledTab;