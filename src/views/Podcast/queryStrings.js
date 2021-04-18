

export function buildString(base_url, queryParams) {
    //Given base url, return full url with query string 
    var base = base_url;
    if(queryParams.Length === 0){
        return base; // No query params, move along
    }else{
        base = base.concat("?");
        for(const param in queryParams){
             base = base.concat(param, "=", queryParams[param], "&");
        }
        /*
        queryParams.forEach( ({name,value}) => { 
            base = base.concat(name, "=", value, "&");
            //console.log(value);
            
        });
        */
        base = base.slice(0, -1); // Remove trailing &
    }
    return base
}