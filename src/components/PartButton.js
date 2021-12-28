import React from "react"

import styles from "./SmartPlayer.module.css"

const PartButton =(props)=> {
  return (
    <div 
      onClick={props.onClick}
      className={styles.button+(props.active?" "+styles.activeButton:"")}
    >
      {props.title}
    </div>
  )
}

export default PartButton;