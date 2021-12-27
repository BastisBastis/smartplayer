import React,{useState,useRef,useEffect} from "react"
import MyErrorBoundry from "./ErrorBoundry";
import VideoPlayer from "./VideoPlayer"
import Toolbar from "./Toolbar"

import videoFile from "../assets/starwars.mp4"

import styles from "./SmartPlayer.module.css"

const STATE_LOADING=0;
const STATE_READY=1;
const STATE_PLAYING=2;
const STATE_PAUSED=3;
const STATE_FINISHED=4;

const SmartPlayer = ()=> {
  const [playState,setPlayState]=useState(STATE_LOADING);
  
  const toolbarRef = useRef()
  const [parts,setParts]=useState([])
  
  const [visibleCanvases,setVisibleCanvases] = useState([...parts.map(part=>part.index)])
  
  useEffect(()=>{
    
    setParts(
      [
   {hiddenPos:{x:0,y:0},title:"Trombon",index:0},
   {hiddenPos:{x:0,y:0},title:"Valthorn",index:1},
   {hiddenPos:{x:0,y:0},title:"Klarinett",index:2},
   {hiddenPos:{x:0,y:0},title:"Klockspel",index:3},
   {hiddenPos:{x:0,y:0},title:"Trumpet",index:4},
   {hiddenPos:{x:0,y:0},title:"Saxofon",index:5},
   {hiddenPos:{x:0,y:0},title:"Elbas",index:6},
   {hiddenPos:{x:0,y:0},title:"Cello",index:7},
   {hiddenPos:{x:0,y:0},title:"Slagverk",index:8},
   {hiddenPos:{x:0,y:0},title:"Fiol",index:9},
   {hiddenPos:{x:0,y:0},title:"Tvärflöjt",index:10},
   {hiddenPos:{x:0,y:0},title:"Piano",index:11}
   //0,1,2,3,4,5,6,7,8,9,10,11
  ]
    )
  },[])
  //const parts=
  
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
  
  const setHiddenPos=()=>{
    const tempParts=parts.map((part,i)=>{
      const btnRect=toolbarRef.current.children[i].getBoundingClientRect()
      part.hiddenPos={x:btnRect.left+10,y:btnRect.top+10};
      return part;
    })
    
    setParts(tempParts)
  }
  
  useEffect(()=>{
    if (playState===STATE_READY) {
      setHiddenPos()
    }
  },[playState])
  
  
  
  
  return (
    <MyErrorBoundry>
    <div className={styles.pageContainer} >
      <Toolbar 
        ref={toolbarRef} 
        parts={parts} 
        visibleCanvases={visibleCanvases}
        callback={togglePart} 
        setParts={setParts}
      />
      <VideoPlayer 
        videoSrc=    {videoFile}
        y=           {toolbarRef.current&&toolbarRef.current.getBoundingClientRect().height}
        rows=        {rows}
        width=       {1280}
        height=      {720}
        startY=      {186}
        partHeight=  {179}
        columns=     {columns}
        parts=       {parts}
        frameMarginY={4}
        visibleCanvases={visibleCanvases}
        onLoaded={()=>setPlayState(STATE_READY)}
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
          setPlayState(STATE_PLAYING);
          showAll();
          }
        }
      >
        Start
      </div>}
    </div>
    </MyErrorBoundry>
  )
}

export default SmartPlayer;