import React, {useState} from 'react'
import Slide from '@material-ui/core/Slide';
import 'assets/css/AboutPage.css'
export default function ContactPage({}){
    return(
        <>
            <div className="about-title">
                Contact
            </div>
            <Slide direction="up" in={true} style={{ transitionDelay:'800ms'}}>
                <div className="about-container">
                    <div className="about-wrapper">
                        <div className="about-sub-title">
                            For questions. Comments. Concerns and anything else. Please use the below email address 
                        </div>
                        
                    </div>
                    <p> support[at]soundfiles[dot]fm</p>
                </div>
            </Slide>
        </>
        )
}