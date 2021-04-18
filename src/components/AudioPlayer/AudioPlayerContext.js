import { createContext } from 'react';
  /* 
    Playlist in the form 
      [ {playlist_pk:null, playlist_name: null, 
            audio:null, image: null, 
            title:null, 
            pk:null },  {...}] 
  */
export const AudioPlayerContext = createContext(null);