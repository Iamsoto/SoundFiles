import React, { useState, useEffect } from 'react'

import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";

import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,

} from "react-share";

import 'assets/css/Share.css'


export default function Share({left}){
  const [copied, setCopied] = useState(false)
  const [onMobile, setOnMobile] = useState(false)

  const mobileSetter = () => {
      if(window.innerWidth <= 360){
          if(!onMobile){
              setOnMobile(true)
          }
                      
      }else{
          if(onMobile){
              setOnMobile(false) 
          }
      }
  }

  useEffect(()=>{
      /**
          Hook to use on window inner width
      */
      mobileSetter()
      window.addEventListener('resize', mobileSetter );

      return () => window.removeEventListener('resize', mobileSetter);

  }, [window.innerWidth])  

  return (
    <>{left 
        ?<div className="share-icons-container-left">
          <FacebookShareButton url={window.location.href}><FacebookIcon size={onMobile? 25 : 32} round={true}/></FacebookShareButton>
          <TwitterShareButton url={window.location.href}><TwitterIcon size={onMobile? 25 : 32} round={true}/></TwitterShareButton>
          <TelegramShareButton url={window.location.href}><TelegramIcon size={onMobile? 25 : 32} round={true}/> </TelegramShareButton>
          <WhatsappShareButton url={window.location.href}><WhatsappIcon size={onMobile? 25 : 32} round={true}/></WhatsappShareButton>
          <ClickAwayListener onClickAway={()=>(setCopied(false))}>
            <Tooltip title={copied ? "Copied!" : "Copy URL"} aria-label="Copy Link">
              <IconButton onClick={() => {navigator.clipboard.writeText(window.location.href); setCopied(true);}}><LinkIcon/></IconButton>
            </Tooltip>
          </ClickAwayListener>
        </div>

        :<div className="share-icons-container-right">
          <ClickAwayListener onClickAway={()=>(setCopied(false))}>
            <Tooltip title={copied ? "Copied!" : "Copy URL"} aria-label="Copy Link">
              <IconButton onClick={() => {navigator.clipboard.writeText(window.location.href); setCopied(true);}}><LinkIcon/></IconButton>
            </Tooltip>
          </ClickAwayListener>
            <WhatsappShareButton url={window.location.href}><WhatsappIcon size={onMobile? 25 : 32} round={true}/></WhatsappShareButton>
            <TelegramShareButton url={window.location.href}><TelegramIcon size={onMobile? 25 : 32} round={true}/> </TelegramShareButton>
            <TwitterShareButton url={window.location.href}><TwitterIcon size={onMobile? 25 : 32} round={true}/></TwitterShareButton>
            <FacebookShareButton url={window.location.href}><FacebookIcon size={onMobile? 25 : 32} round={true}/></FacebookShareButton> 
        </div>
    }</>
    )
}