import axios from "axios";


const refresh_url = localStorage.getItem("__APIROOT_URL__") + 'api/token/refresh';

export default function GetValidToken(){
    return new Promise((resolve, reject) => {
        var curTime = new Date().getTime()/1000;
        var refreshTime = localStorage.getItem("last_refreshed");
        var refreshRate = localStorage.getItem("refresh_rate");
        var refreshToken = localStorage.getItem("refresh_token");
        var token = localStorage.getItem("token")
        //console.log(refreshToken)
        if(refreshTime === null
            || refreshRate === null
            || refreshToken === null
            || token === undefined){
            reject("Please Login") // tell user to log in
        
        }else if(curTime - refreshTime >= refreshRate) {
            // Need to make a refresh call  
                axios({
                  method: 'post',
                  url: refresh_url,
                  headers: {
                    'Content-Type':'application/json',
                    'Accept':'*/*'
                  },
                  data: JSON.stringify({
                    'refresh': refreshToken})
                }).then((response) => {
                    localStorage.setItem("token", response.data.access);
                    localStorage.setItem("last_refreshed", new Date().getTime()/1000);
                    resolve()
                }).catch((error) =>{
                  if(error.response !== undefined && error.response.data !== undefined){
                    if(error.response.data.detail !== undefined){
                      reject(error.response.data.detail);
                    }else{
                      console.log(error)
                      reject("Please login again");
                    }
                  }else{
                    console.log(error)
                    reject("Please login again");
                  }                    
                })     
        }else{
            resolve() // simply use current localStorage.getItem(token)
        }

    })
}