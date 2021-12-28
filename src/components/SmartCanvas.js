import React, {useState, useEffect, useRef} from 'react'

import styles from "./SmartPlayer.module.css"

export default  SmartCanvas


(props)= {
  
  const canvasRef=useRef()
  
  
  
  useEffect(()=>{
    if (props.time && props.videoRef && canvasRef) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(
        props.videoRef.current,
        props.sourceX,
        props.sourceY+props.frameMarginY,
        props.width,
        props.height-props.frameMarginY*2,
        0,
        0,
        props.width,
        props.height
      );
     
     
    } 
  },[props.time])
  
  return (
    <canvas
      ref={canvasRef}
      className={styles.smartCanvas}
      style={props.style}
      width={props.width}
      height={props.height}
    />
  )
}

export default SmartCanvas;