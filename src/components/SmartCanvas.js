import React, {useState, useEffect, useRef} from 'react'

import styles from "./SmartPlayer.module.css"


export default class SmartCanvas extends React.Component {


  constructor (props) {
    super(props);
    this.canvasRef = React.createRef()
  }
  
  
  draw() {
    
    const ctx = this.canvasRef.current.getContext('2d', { alpha: false });
    ctx.drawImage(
      this.props.videoRef.current,
      this.props.sourceX,
      this.props.sourceY+this.props.frameMarginY,
      Math.floor(this.props.width),
      this.props.height-this.props.frameMarginY*2,
      0,
      0,
      Math.floor(this.props.width),
      Math.floor(this.props.height)
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
        onClick = {this.props.onClick}
      />
    )
  }
}
