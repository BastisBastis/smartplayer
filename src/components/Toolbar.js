import React, {useState, useCallback} from "react";

import PartButton from './PartButton'

import {FiMaximize2 as HideToolsIcon} from "react-icons/fi"
import {CgToolbarTop as ShowToolsIcon} from "react-icons/cg"
import {GiPauseButton as PauseIcon, GiPlayButton as PlayIcon} from "react-icons/gi"

import styles from "./SmartPlayer.module.css"

const Toolbar = React.forwardRef((props,ref)=>{
  
  //const [hidden,setHidden] = useState(false)
  
  const toggleHidden=useCallback(() => {
    
    props.setHideToolbar(!props.hideToolbar);
  }, [props.hideToolbar]);

  
  const top= (props.hideToolbar && ref.current)? -ref.current.getBoundingClientRect().height : 0;
  
  const button = (child, onClick) => {
    //console.log(onClick)
    return (
      <div 
        style={{
          padding:"0.5rem",
          border:"solid 1px black",
          borderRadius:"0.2rem",
          textAlign:"center",
          margin:"0.5rem",
          background:"#fff",
          display:"inline-block"
        }}
        onClick={onClick}
      >
      
        {child}
      </div>
    )
  }
  
  
  
  return (
    <div 
      ref={ref}
      className={styles.toolbar}
      style={{
        opacity:props.hidden?0:1,
        top:top
      }}
    >
      {props.parts.map((part,i)=>{
        
        return (
          <PartButton 
            key={"PartButton"+i}
            onClick={()=>props.callback(i)}
            title={part.title} 
            active={props.visibleCanvases.includes(i)}
          />
        )
      })}
      <div className={styles.floatingToolsContainer} style={
        ref.current && {
          top:ref.current.getBoundingClientRect().height,
          right:0
        }
      }>
        {props.playState===2 && button((<PauseIcon size="20" /> ),props.togglePause)}
        {props.playState===3 && button((<PlayIcon size="20" /> ),props.togglePause)}
        {button((
          props.hideToolbar?(<ShowToolsIcon size="20" />) : (<HideToolsIcon size="20" /> ) 
            
            
        ),()=>toggleHidden())}
      </div>
    </div>
  )
})

export default Toolbar;