export default function SetLocalStorage(response){
  var cur_time = new Date().getTime() / 1000;
  localStorage.setItem("token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  localStorage.setItem("last_refreshed", cur_time)// In seconds
  localStorage.setItem("refresh_rate", 300)// 5 minutes in seconds
}