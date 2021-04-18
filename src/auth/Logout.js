import React from 'react'

export default function Logout(set_state, extra_func){
	/*
		Should the logout func be passed in? Or should this use the
		login context? Too many decisions... 
	*/
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("last_refreshed");// In seconds
  localStorage.removeItem("refresh_rate");// 5 minutes in seconds
  set_state()
  extra_func()
}