export default function GetAuthHeader(){
    /*
        This function will not perform any authentication but will
        assume the current token is valid
    */
    return "Bearer ".concat(localStorage.getItem("token", null));
}