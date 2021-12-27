import React from "react"

import styles from "./SmartPlayer.module.css"

const PartButton = React.forwardRef((props,ref)=> {
  return (
    <div 
      ref={ref}
      onClick={props.onClick}
      className={styles.button+(props.active?" "+styles.activeButton:"")}
    >
      {props.title}
    </div>
  )
})

export default PartButton;