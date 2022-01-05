import React from "react"

import styles from "./SmartPlayer.module.css"

const LoadingBar = (props) => {
  
  return (
    <div className={styles.loadingOuterContainer}>
      Laddar...
      <div className={styles.loadingInnerContainer}>
        <div 
          className={styles.loadingBar}
          style={{
            width:(props.loaded/props.total)*100+"%"
          }}
        
        >
        Det är bara lite kvar, ha lite tålamod!
        </div>
      </div>
    </div>
  )
}

export default LoadingBar;