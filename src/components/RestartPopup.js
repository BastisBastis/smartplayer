import React from "react"

import {VscDebugRestart as RestartIcon} from "react-icons/vsc"

import styles from "./SmartPlayer.module.css"

const RestartPopup =(props)=> {
  return (
    <div 
      onClick={props.onClick}
      className={styles.popup}
      style={{textAlign:"center"}}
    >
      {"Från början?"}<br />
      <RestartIcon size={40} />
    </div>
  )
}

export default RestartPopup;