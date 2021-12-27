import React, {useState} from "react";

import PartButton from './PartButton'

import styles from "./SmartPlayer.module.css"

const Toolbar = React.forwardRef((props,ref)=>{
  return (
    <div 
      ref={ref}
      className={styles.toolbar}
    >
      {props.parts.map((part,i)=>{
        
        return (
          <PartButton 
            onClick={()=>props.callback(i)}
            title={part.title} 
            active={props.visibleCanvases.includes(i)}
          />
        )
      })}
    </div>
  )
})

export default Toolbar;