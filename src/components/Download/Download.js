import React, { useState, useEffect } from 'react'
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';


export default function Download({src, name}){


	return(
		<>
			<a href={src} download><GetAppIcon/></a>
		</>
		)

}