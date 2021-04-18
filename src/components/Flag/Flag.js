import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FlagIcon from '@material-ui/icons/Flag';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import GetAuthHeader from "auth/GetAuthHeader";
import GetValidToken from "auth/GetValidToken";
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '10px',
      maxWidth:'100%',
    },
  },
  backdrop: {
    zIndex: -10,
    color: '#fff',
  },

}));

export default function Flag({episode_comment_pk, podcast_pk, user_flagged, reasons}){
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null)
    const [selected, setSelected] = useState(null)
    const [reason, setReason] = useState("")
    const [otherReason, setOtherReason] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [error, setError] = useState("")
    const submit_flag_url = localStorage.getItem("__APIROOT_URL__") +'system/flag';

    const submitFlag = (event) => {
        event.preventDefault()
        let payload = {}
        if(episode_comment_pk != null){
            payload={
                episode_comment_pk:episode_comment_pk,
                reason:reason
            }
        }else{
            payload={
                podcast_pk:podcast_pk,
                reason:reason
            }
        }

        GetValidToken().then(()=>{
            axios({
                method: 'post',
                url: submit_flag_url,
                headers: {
                  'Content-Type':'application/json',
                  'Accept':'*/*',
                  'Authorization': GetAuthHeader()
                },
                data: payload
              }).then((response) => {
                if(response.data && response.data.success){
                    setSuccessMsg(response.data.success)
                    setReason("")
                }
              }).catch((error)=>{
                if(error.response && error.response.data && error.response.data.detail){
                    setError(error.response.data.detail)
                }else{
                    setError("Something bad happened. Please try again later")
                }
                setSuccessMsg("")
              })

      }).catch(msg =>{ // Authentication Error
        setSuccessMsg("")
        setError("Please try logging in again")
      })
    }

    const handleInputChange = (event) => {
        event.preventDefault()
        setReason(event.target.value)
    }

    const handleFormChange = (event, index, value) => {
        event.preventDefault()
        setSelected(index)
        if(index === reasons.length){
            setReason("")
            setOtherReason(true)
        }else{
            setOtherReason(false)
            setReason(value)
        } 
    }

    const handleClose = (event) => {
        event.preventDefault()
        setAnchorEl(null)
    }

    const onClickFlag = (event) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget)
    }

    return(
        <>
            <IconButton onClick={onClickFlag}>
                <FlagIcon style={user_flagged ? {color:"red", fontSize:"15px"} : {fontSize:"15px"}}/>
            </IconButton>


              <Grid container p={2}>
                <Menu
                  id="flag-popup-id"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >

                {error != "" 
                    ? <Alert severity="error">{error}</Alert>
                    : null
                }

                {successMsg != "" 
                    ? <Alert severity="success">{successMsg}</Alert>
                    : null
                }
                <FormGroup row={false}>
                <FormLabel component="legend">Reason to flag content:</FormLabel>
                
                {reasons.map((reason, i)=> (
                    <FormControlLabel
                      label={reason}
                      key={`flag-reason-${i}`}
                      labelPlacement="end"
                      style={{paddingLeft:"10px"}}
                      control={
                        <Checkbox 
                          checked={selected === i}
                          onChange={e => handleFormChange(e, i, reason)}
                          color="primary"/>}
                    />
                  )
                )}
                
                <FormControlLabel
                  label="Other"
                  labelPlacement="end"
                  style={{paddingLeft:"10px"}}
                  control={
                    <Checkbox 
                      checked={selected === reasons.length}
                      onChange={e => handleFormChange(e, reasons.length, "")}
                      color="primary"/>}
                    />

                { otherReason ? 
                    
                        <TextField 
                          id="flag-other-reason" 
                          helperText="Reason:"
                          value={reason}
                          style={{margin:"5px"}}
                          onChange={handleInputChange}
                        />
                    
                : null }
                <Button color="inherit" onClick={submitFlag}>Submit</Button>
                </FormGroup>


                </Menu>

              </Grid>

        </>
        )
}