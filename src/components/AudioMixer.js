import React from "react"

import AudioChannel from "./AudioChannel"

export default class AudioMixer extends React.Component {
  
  constructor (props) {
    super(props)
    this.channels=[];
    //this.syncTimer;
  }
  
  /*
  initialSyncFix () {

    if (this.props.videoRef && this.props.videoRef.current.currentTime && (this.props.videoRef.current.currentTime/this.props.videoRate)>Math.abs(this.props.audioDelay)) {
      this.seek(this.props.videoRef.current.currentTime/this.props.videoRate-this.props.audioDelay);
      
      this.syncTimer=setInterval(()=>this.syncFix(), 5000);
    }
    else {
      setTimeout(()=>{this.initialSyncFix()},100);
    }
  }
  
  
  syncFix () {
    
    if (Math.abs(this.props.videoRef.current.currentTime/this.props.videoRate - (this.channels[0].time + this.props.audioDelay)) > 0.05) {

      this.props.videoRef.current.currentTime = (this.channels[0].time + this.props.audioDelay)*this.props.videoRate;
      //console.log("Repaired sync");
    }
  }
  */
  
  play() {
    
    this.channels.forEach(channel=>{
      channel.play();
    })
    // this.initialSyncFix();
  }
  
  stop() {
    clearInterval(this.timer);
    this.channels.forEach(channel=>{
      channel.stop();
    })
  }
  
  pause() {
    //clearInterval(this.timer)
    this.channels.forEach(channel=>{
      channel.pause();
    })
  }
  
  seek(time) {
    this.channels.forEach(channel=>{
      channel.seek(time);
    })
  }
  
  get delay() {
    return this.props.audioDelay
  }
  
  get time() {
    return this.channels.length>0 ? this.channels[0].time : -1;
  }
  
  render() {
    
    return (<>
      {this.props.parts.map((part,i)=>{
        return (
          <AudioChannel
          key={"Audio"+i}
          src={part.src}
          ref={channel=>this.channels[i]=channel}
          mute={!this.props.activeChannels.includes(i)}
          onLoad={this.props.onChannelLoaded}
        /> )
      })}
    </>)
  }
  
}