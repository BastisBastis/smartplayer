import React, {useState, useEffect, useRef} from 'react'

import styles from "./SmartPlayer.module.css"

export default class SmartCanvas extends React.Component {


  constructor (props) {
    super(props);
    this.canvasRef = React.createRef()
  }
  
  
  draw() {
    
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.drawImage(
      this.props.videoRef.current,
      this.props.sourceX,
      this.props.sourceY+this.props.frameMarginY,
      this.props.width,
      this.props.height-this.props.frameMarginY*2,
      0,
      0,
      this.props.width,
      this.props.height
    );  
    
  }
    
  
  render() {
    return (
      <canvas
        ref={this.canvasRef}
        className={styles.smartCanvas}
        style={this.props.style}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}