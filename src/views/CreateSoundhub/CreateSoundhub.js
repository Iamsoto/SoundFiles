import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import RSSForm from 'components/RSSForm/RSSForm.js';
import GetValidToken from 'auth/GetValidToken.js'

import LoginPage from 'views/LoginPage/LoginPage.js'
import { LoginContext } from 'auth/LoginContext.js'

export default function CreateSoundhub(props){
    const { loggedIn,  setLoggedIn } = useContext(LoginContext);

    return(
        <div>
            <Grid container>                
                <Grid item xs={12}>
                        {!loggedIn
                            ? <LoginPage redirectURL="/"/> 
                            : <RSSForm/>
                        }
                </Grid>
            </Grid>
        </div>
        )
}