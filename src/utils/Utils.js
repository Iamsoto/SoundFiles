
export function convertDate(date_str){
    let diffInMilliSeconds = Math.abs(Date.now() - new Date(date_str)) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    if(days <= 0){  // No days have passed
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        if(hours <= 0){
            const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
            diffInMilliSeconds -= minutes * 60;
            if(minutes <= 1){
                return "Just now!"
            }else{
                return `${minutes} minutes ago`
            }
        }else{
            return `${hours} hours ago`
        }          
    }else if(days > 364){
        return `${Math.round((Number(days/364)*10)/10 )} years ago`
    
    }else if (days > 30){
        // days > 1 <= 30
        return `${Math.round((Number(days/30)*10)/10 )} months ago` 
    }else{
        return `${days} days ago`
    }         
}


export function convertSeconds(seconds){
    let time_str = ''
    let hours = Math.round(seconds/3600)
    if(hours < 10){
        hours = "0".concat(hours)
    }
    seconds %= 3600
    let minutes = Math.round(seconds/60)
    if(minutes < 10){
        minutes = "0".concat(minutes)
    }
    seconds %= 60
    if(seconds < 10){
        seconds = "0".concat(seconds)
    }
    if (hours != "00"){
        time_str = hours + ":" + minutes + ":" + seconds
    }else{
        time_str = minutes + ":" + seconds
    }
    
    return time_str

}