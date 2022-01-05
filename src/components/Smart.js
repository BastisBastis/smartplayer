import React, {useState} from "react"

import SmartPlayer from "./SmartPlayer"
import styles from "./SmartPlayer.module.css"

import StarwarsPaths from "../assets/starwarsPaths"

const Smart = ()=>{
  const [video,setVideo]=useState(null);
  
  const setResolution = (res)=>{
    const videoSrc=StarwarsPaths.video[res]
    setVideo({
      ...StarwarsPaths,
      videoSrc:videoSrc
    })
  }
  
  const buttonStyle={
    margin:"0.5rem",
    textAlign:"center"
  }
  
  if (video) {
    return (
      <SmartPlayer
        videoData={video}
      />
    )
  } else {
    return (
      <>
        <div 
          className={styles.button} 
          style={buttonStyle}
          onClick={()=>setResolution("low")}
        >
          Liten fil
        </div>
        <div 
          className={styles.button} 
          style={buttonStyle}
          onClick={()=>setResolution("high")}
        >
          Stor fil
        </div>
      </>
    )
  }
  
}

export default Smart;