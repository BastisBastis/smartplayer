import React, {useState} from 'react';
import styles from "./AnimTest.module.css"

const AnimTest = () => {
  
  const [vis,setVis]=useState(false)
  
  const toggle=()=>{
    setVis(!vis);
  }
  
  const cls =styles.box//+ (vis?" "+styles.visible:"")
  
  const stl = vis ?
    {top:"20%"} : {}
  
  return (
    <div className={cls} onClick={toggle} style={stl}>
      
    </div>
  )
}

export default AnimTest