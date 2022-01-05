import {useEffect, useState,useCallback} from "react"



const useSynchronizer = (playState, videoRef, audioRef,setDebugLabel) => {
  
  const [syncTimer,setSyncTimer] = useState(null)
  
  
  const syncFix=()=>{
    //setDebugLabel("syncFix "+Date.now())
    const video=videoRef.current;
    const audio=audioRef.current;
    if (Math.abs(video.currentTime/video.playbackRate - (audio.time + audio.delay)) > 0.05) {

      video.currentTime = (audio.time + audio.delay)*video.playbackRate;
      //alert("Repaired sync");
    } else {
      //alert('Sync not neeeded')
    }
    setSyncTimer(setTimeout(()=>syncFix(), 5000));
  }
  
  const initialSyncFix= useCallback(()=>{
    //setDebugLabel("isf "+playState+" "+Date.now())
    if (playState!==2) {
      return false;
    }
    const video=videoRef.current;
    const audio=audioRef.current;
    if (video.currentTime && (video.currentTime/video.playbackRate)>Math.abs(audio.delay)) {
      audio.seek(video.currentTime/video.playbackRate-audio.delay);
      //setDebugLabel("isf done "+Date.now())
      setSyncTimer(setTimeout(()=>syncFix(), 5000));
    }
    else {
      setSyncTimer(setTimeout(()=>{initialSyncFix()},100));
    }
  },[playState])
  
  useEffect(()=>{
    //setDebugLabel("playState "+playState)
    if (playState===2 && videoRef && audioRef)
    
      initialSyncFix();
    if (syncTimer && playState!==2) {
      //setDebugLabel("playState "+playState)
      clearTimeout(syncTimer)
      setSyncTimer(null)
    }
  },[playState,videoRef,audioRef])
  
}

export default useSynchronizer;