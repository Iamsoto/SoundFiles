import axios from "axios"

const login_url = localStorage.getItem("__APIROOT_URL__") + 'api/token';

export default function Login(email, password){
   return axios({
          method: 'post',
          url: login_url,
          headers: {
            'Content-Type':'application/json',
            'Accept':'*/*'
          },
          data: JSON.stringify({
            'email': email,
            'password':password,

        })
    })  
}