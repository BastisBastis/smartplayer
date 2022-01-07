import React,{useState,useRef,useEffect, useCallback} from "react"
import VideoPlayer from "./VideoPlayer"
import Toolbar from "./Toolbar"
import AudioMixer from "./AudioMixer"
import LoadingBar from "./LoadingBar"
import RestartPopup from "./RestartPopup"

import useSynchronizer from "./useSynchronizer"
import {useWindowSize} from '@react-hook/window-size'


import styles from "./SmartPlayer.module.css"

const STATE_LOADING=0;
const STATE_READY=1;
const STATE_PLAYING=2;
const STATE_PAUSED=3;
const STATE_FINISHED=4;

const SmartPlayer = (props)=> {
  
  const [debugLabel,setDebugLabel] = useState("")
  
  const [playState,setPlayState]=useState(STATE_LOADING);
  
  const [loadedMedia,setLoadedMedia] = useState(0);
  
  const toolbarRef = useRef()
  const audioRef = useRef()
  const videoRef= useRef()
  const [parts,setParts]=useState([])
  
  const [videoBounds,setVideoBounds] = useState({x:0,y:0,width:0,height:0})
  const [hideToolbar, setHideToolbar] = useState(false);
  const [windowSize, setWindowSize] = useState();
  
 
  useSynchronizer(playState,videoRef,audioRef,setDebugLabel);
  const [windowWidth, windowHeight] = useWindowSize()
  
  
  const [visibleCanvases,setVisibleCanvases] = useState([...parts.map(part=>part.index)])
  
  useEffect(()=>{
    setParts(
      [ ...props.videoData.audio.map((part,index)=>{ return {
    hiddenPos:{x:0,y:0},
    index:index,
    ...part
    }
    })
  ]
    )
  },[])
  
  const showAll=()=>{
    setVisibleCanvases([...parts.map(part=>part.index)])
  }
  
  const rows=3;
  const columns=4;
  
  const togglePart=(part)=>{
    let tempParts=[];
    if (visibleCanvases.filter(canvas=>canvas==part).length>0)
      tempParts=visibleCanvases.filter(canvas=>canvas!=part)
    else
      tempParts=[...visibleCanvases,part];
    
    setVisibleCanvases(tempParts)
  }
  
  
  const setHiddenPos=useCallback(()=>{
    if (parts.length<1)
      return false;
    const tempParts=parts.map((part,i)=>{
      const btnRect=toolbarRef.current.children[i].getBoundingClientRect()
      //part.hiddenPos={x:btnRect.left+10,y:btnRect.top+10};
      part.hiddenPos={x:btnRect.left+10,y:-40}
      return part;
    })
    
    setParts(tempParts)
  },[videoBounds])
  
  useEffect(()=>{
    setHiddenPos()
  },[videoBounds])
  
  const updateSize=useCallback(()=>{
    
    const y=toolbarRef?(hideToolbar?0:toolbarRef.current.getBoundingClientRect().height)+  60 :0;
    
    setVideoBounds({
      x:0,
      y:y,
      //height:window.innerHeight-y,
      //width:window.innerWidth
      height:windowHeight-y,
      width:windowWidth
    })
    
    //setHiddenPos();
  },[ hideToolbar,toolbarRef, windowWidth, windowHeight])
  
  useEffect(()=>{
    updateSize()
  },[hideToolbar,toolbarRef,playState])
  
  useEffect(()=>{
    
    if (playState===STATE_READY) {
      setHiddenPos()
    } else if (playState===STATE_FINISHED) {
      audioRef.current.stop();
      //videoRef.current.stop();
    } else if (playState===STATE_PAUSED) {
      audioRef.current.pause();
      videoRef.current.pause();
    }
  },[playState])
  
  const togglePause=useCallback(()=>{
    setPlayState(prev=>{
      if (prev===STATE_PAUSED) {
        audioRef.current.play()
        return STATE_PLAYING;
      } else if (prev===STATE_PLAYING) {
        return STATE_PAUSED;
      }
    })
  }, [playState,videoRef])
  
  const mediaItemLoaded=()=>{
    
    setLoadedMedia(prev=>prev+1)
    
  }
  
  useEffect(()=>{
    if (loadedMedia>=props.videoData.audio.length+1) {
      setPlayState(STATE_READY)
      
    }
  },[loadedMedia])
  
  
  
  return (
    <>
    <div className={styles.pageContainer} >
      <AudioMixer
        ref={audioRef}
        audioDelay={props.videoData.audioDelay}
        videoRate={props.videoData.videoRate}
        videoRef={videoRef}
        parts={props.videoData.audio}
        setDebugLabel={setDebugLabel}
        activeChannels={visibleCanvases}
        onChannelLoaded={mediaItemLoaded}
        
      />
      <Toolbar 
        hidden={playState<STATE_PLAYING}
        ref={toolbarRef} 
        parts={parts} 
        visibleCanvases={visibleCanvases}
        callback={togglePart} 
        setParts={setParts}
        hideToolbar={hideToolbar}
        setHideToolbar={setHideToolbar}
        togglePause={togglePause}
        playState={playState}
      />
      <VideoPlayer 
        hidden={playState!==STATE_PLAYING && playState!==STATE_PAUSED}
        videoRef=    {videoRef}
        videoSrc=    {props.videoData.videoSrc}
        y=           {toolbarRef.current&& toolbarRef.current.getBoundingClientRect().height+toolbarRef.current.getBoundingClientRect().top+60}
        rows=        {rows}
        width=       {props.videoData.width}
        height=      {props.videoData.height}
        startY=      {props.videoData.startY}
        partHeight=  {props.videoData.partHeight}
        columns=     {columns}
        parts=       {parts}
        frameMarginY={props.videoData.frameMarginY}
        playbackRate={props.videoData.videoRate}
        duration=    {props.videoData.duration}
        visibleCanvases={visibleCanvases}
        videoBounds= {videoBounds}
        onLoaded={()=>{
          videoRef.current.playbackRate=props.videoData.videoRate;
          mediaItemLoaded();
          } }
        onEnded={()=>{
          setPlayState(STATE_FINISHED);
        }}
        isPlaying={playState===STATE_PLAYING}
      />
      {playState===STATE_READY && 
      <div 
        className={styles.button}
        style={{
          position:"absolute",
          zIndex:10000,
          top:"50%",
          left:"50%",
          transform:"translate(-50%,-50%)",
          fontSize:"2rem",
          padding:"1rem"
          }}
        onClick={()=>{
          audioRef.current.play()
          setPlayState(STATE_PLAYING);
          showAll();
          }
        }
      >
        Start
      </div>}
    </div>
    { playState===STATE_LOADING && (
      <LoadingBar 
        loaded={loadedMedia}
        total={props.videoData.audio.length}
      />
      )
    }
    { (playState===STATE_FINISHED) && (
      <RestartPopup 
        onClick={()=>{
          audioRef.current.play()
          setPlayState(STATE_PLAYING);
        }}
      />
    )}
    <div style={{
        position:"absolute",
        fontSize:"2rem",
        top:"50px",
        left:"50px",
        zIndex:10001
      }} >
        {debugLabel}
      </div>
    </>
  )
}

export default SmartPlayer;
