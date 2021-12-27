import React, {useState, useEffect, useRef} from "react";

import SmartCanvas from "./SmartCanvas"


//calculates the amount of rows that give the largest canvases
const getOptimalRows=(items,ratio,totalHeight)=> {
  const maxRows=8;
  let bestWidth=0;
  let bestRows;
  const totalWidth = window.innerWidth;
  
  for (let rows = 1; rows<maxRows;rows++) {
    const cols = Math.ceil(items/rows);
    const w = Math.min(totalWidth/cols,(totalHeight/rows)*ratio);
    if (w>bestWidth) {
      bestWidth=w;
      bestRows=rows;
    }
  }
  return bestRows;
}

const VideoPlayer = ({
  y=0,
  isPlaying,
  onLoaded,
  videoSrc,
  width, 
  height,
  partWidth,//optional
  partHeight,//optional
  parts,
  rows,
  columns,
  startY=0,
  frameMarginY,
  visibleCanvases=[]
})=> {
  
  
  const videoRef= useRef(null);
  
  const [canvasPositions,setCanvasPositions] = useState([])
  
  //Updating time tells the canvases to update the frame
  const [time,setTime]=useState(null)
  
  partWidth=partWidth|| width/columns;
  partHeight=partHeight|| height/rows;
  const partRatio = partWidth/partHeight;
  
  
  //Position the visible canvases
  const layout=()=>{
    const positions=[];
    
    //Area = the available part of the page
    const areaWidth=window.innerWidth;
    const areaHeight=window.innerHeight-y;
    const areaX=0;
    const areaY=y;
    
    const canvasRows=getOptimalRows(visibleCanvases.length,partRatio,areaHeight);
    const canvasColumns=Math.ceil(visibleCanvases.length/canvasRows);
    const canvasMaxWidth=areaWidth/canvasColumns;
    const canvasMaxHeight=areaHeight/canvasRows;
    const canvasWidth = Math.min(canvasMaxWidth,canvasMaxHeight*partRatio);
    const canvasHeight = canvasWidth/partRatio;
    
    
    visibleCanvases.forEach((canvas, i)=>{
      
      //const canvasX=areaX+(i%canvasColumns)*canvasWidth;
      const canvasX= areaX+(areaWidth-canvasWidth*canvasColumns)/2+(i%canvasColumns)*canvasWidth;
      const canvasY=areaY+Math.floor(i/canvasColumns)*canvasHeight;
      
      positions.push({
        canvas:canvas,
        x:canvasX,
        y:canvasY,
        width:canvasWidth
      })
    })
    setCanvasPositions(positions)
    
  }
  
  useEffect(()=>{
    layout();
  },[visibleCanvases,y])
  
  
  
  
  //Render function of all the canvases
  //Optimize this as much as possible!
  const canvasCollection = ()=>{
    if (!videoRef) {
      console.log("No videoRef when set to isPlaying");
      return false;
    }
    
    return (
      <>
        {parts.map((part,i) => {
          const col=i%columns;
          const row=Math.floor(i/columns)
          const canvasW=window.innerWidth/columns;
          const position = canvasPositions.find((canvas)=>Number(canvas.canvas)===i);
          
          const style = position?{
            transform:`translate(${position.x}px, ${position.y}px) scale(${position.width/200}) `
            
          } : {
            transform: `translate(${part.hiddenPos.x}px, ${part.hiddenPos.y}px) scale(0.1)`
            }
          
          return (
            <SmartCanvas
              key={"smartCanvas"+i}
              time={time}
              style={style}
              videoRef={videoRef}
              width={partWidth}
              height={partHeight}
              frameMarginY={frameMarginY}
              sourceX={partWidth*col}
              sourceY={startY+partHeight*row}
              isPlaying={isPlaying}
            />
          )
        })}
      </>
    )
  }
  
  //Start video and start canvas draw loop when isPlaying prop is set to true
  useEffect(()=>{
    if (videoRef && isPlaying) {
      videoRef.current.play()
      setInterval(()=>{
        setTime(Date.now());
      },1000/60)
    }
  },[isPlaying])
 
  
  return (
    <>
      <video 
        hidden
        width={width}
        src={videoSrc}
        playsInline
        muted
        preload={'auto'}
        ref={videoRef}
        onLoadedMetadata={onLoaded}
      ></video>
      {canvasCollection()}
    </>
  )
  
}

export default VideoPlayer;