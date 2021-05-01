import React, {useState} from 'react'
import Slide from '@material-ui/core/Slide';
import 'assets/css/AboutPage.css'
export default function AboutPage({}){
    return(
        <>
            <div className="about-title">
                About SoundFiles.fm
            </div>
            <Slide direction="up" in={true} style={{ transitionDelay:'800ms'}}>
                <div className="about-container">
                    <div className="about-wrapper">
                        <div className="about-sub-title"> Disclaimer </div>
                        <p>SoundFiles.fm was developed with the intent to bring a stronger sense of community to the podcasting world!
                        <br/>All Audio and third party images are served directly from the content producer's servers</p>

                        <div className="about-sub-title"> My Statement </div>
                        <p> I'm Brian, the primary developer behind SoundFiles.fm. There's a lot that still needs to get done, and 
                            I very much appreciate your attention and any and all appreciation for the platform. 
                            I hope SoundFiles.fm can continue to be a place to listen to, share and discuss podcasts
                            and the ideas they contain. I believe only through the honest and thorough discussion of difficult ideas
                            can we make sense of this chaotic, confusing world we live in. I think podcasts are a wonderful new(ish) media
                            and with the help of the right technology, we can help fascilitate some of these discussions - and also, have fun!
                        </p>

                        <div className="about-sub-title"> Going Forward </div>
                        <p> Right now the platform is 100% free. If you like this service and want to see it grow, please consider
                            giving suppor tthrough Patreon (click on the 'membership' tab up top if you're logged in). There will likely 
                            be a premium tier in the near future where subscribers get greater access to features. If you donate now, I'll be sure 
                            to give your account some form of discount for these features. 
                        </p> 
                    </div>
                </div>
            </Slide>
        </>
        )
}