import React, { useState, useEffect } from 'react'
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import ProfileSpecific from 'components/Profile/ProfileSpecific.js'

export default function Username({text, pk, small=false}){
    const [anchor, setAnchor] = useState(null)

    const handleOpen = (e) => {
        setAnchor(e.currentTarget)
    }

    const handleClose = () =>{
        setAnchor(null)
    }

    return (
        <>
            <Button style={{fontSize:"10px", minWidth:0, minHeight:0, padding:0, margin:0}} onClick={handleOpen}> 
                {text}
            </Button>
            
            <Menu
              id={`username-menu-${pk}`}
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={handleClose}
            >
                <ProfileSpecific user={pk}/>
            </Menu>
        </>
        )
}