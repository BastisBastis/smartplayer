import React from "react"
import ReactHowler from "react-howler"

export default class AudioChannel extends React.Component {
  
  state={
    playing:false
  }
  
  constructor (props) {
    super(props);
    this.player;
  }
  
  stop() {
    if (this.player) {
      this.pause()
      this.player.seek(0.0);
    }
  }
  
  pause() {
    this.setState({
      ...this.state,
      playing:false
    })
  }
  
  seek(time) {
    this.player.seek(time);
  }
  
  get isPlaying() {
    return this.state.playing;
  }
  
  get time() {
    return this.player.seek();
  }
  
  play() {
    this.setState({
      ...this.state,
      playing:true
    })
  }
  
  render() {
    return(
      <ReactHowler
        preload={true}
        playing={this.state.playing}
        src={this.props.src}
        ref={(ref) => (this.player = ref)}
        mute={this.props.mute}
        onLoad={this.props.onLoad}
      />
    );
  }
  
}