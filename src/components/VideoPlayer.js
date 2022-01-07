import React, {useState, useEffect, useRef} from "react";



import SmartCanvas from "./SmartCanvas"

let count=0;
let startTime;

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
  visibleCanvases=[],
  videoRef,
  hidden,
  onEnded,
  duration,
  videoBounds
}) =>{
  
  
  //const videoRef= useRef(null);
  const canvasCollectionRef=useRef([]);
  const bufferRef = useRef(null)
  

  

  
  const [canvasPositions,setCanvasPositions] = useState([])
  
  //Updating time tells the canvases to update the frame
  const [time,setTime]=useState(null)
  
  partWidth=partWidth|| width/columns;
  partHeight=partHeight|| height/rows;
  const partRatio = partWidth/partHeight;
  
  
  //Position the visible canvases
  const layout= React.useCallback(()=>{
    const positions=[];
    
    //Area = the available part of the page
    const areaWidth=videoBounds.width
    const areaHeight=videoBounds.height;
    const areaX=videoBounds.x;
    const areaY=videoBounds.y;
    
    const canvasRows=getOptimalRows(visibleCanvases.length,partRatio,areaHeight);
    const canvasColumns=Math.ceil(visibleCanvases.length/canvasRows);
    const canvasMaxWidth=areaWidth/canvasColumns;
    const canvasMaxHeight=areaHeight/canvasRows;
    const canvasWidth = Math.min(canvasMaxWidth,canvasMaxHeight*partRatio);
    const canvasHeight = canvasWidth/partRatio;
    
    
    visibleCanvases.forEach((canvas, i)=>{
      let canvasX= areaX+(areaWidth-canvasWidth*canvasColumns)/2+(i%canvasColumns)*canvasWidth;
      const canvasY=areaY+Math.floor(i/canvasColumns)*canvasHeight;
      
      //Center last row
      if (Math.floor(i/canvasColumns)===canvasRows-1) {
        canvasX+= ((canvasColumns*canvasRows)-visibleCanvases.length)*canvasWidth/2;
      }
      
      positions.push({
        canvas:canvas,
        x:Math.floor(canvasX),
        y:Math.floor(canvasY),
        width:canvasWidth
      })
    })
    setCanvasPositions(positions)
    
  },[visibleCanvases,videoBounds,parts])
  
  useEffect(()=>{
    
    layout();
  },[visibleCanvases,videoBounds,parts])
  
  //Render function of all the canvases
  const canvasCollection = ()=>{
    if (!videoRef) {
      console.log("No videoRef when set to isPlaying");
      return false;
    }
    
    return (
      <div>
        {parts.map((part,i) => {
          const col=i%columns;
          const row=Math.floor(i/columns)
          const position = canvasPositions.find((canvas)=>Number(canvas.canvas)===i);
          
          const style = position?{
            transform:`translate(${position.x}px, ${position.y}px) scale(${position.width/200}) `
            
          } : {
            transform: `translate(${Math.floor(part.hiddenPos.x)}px, ${Math.floor(part.hiddenPos.y)}px) scale(0.1)`
            }
          
          if (hidden)
            style.display="none";
          
          return (
            <SmartCanvas
              key={"smartCanvas"+i}
              ref={el=>canvasCollectionRef.current[i]=el}
              time={time}
              style={style}
              videoRef={bufferRef}
              width={Math.floor(partWidth)}
              height={Math.floor(partHeight)}
              frameMarginY={frameMarginY}
              sourceX={Math.floor(partWidth*col)}
              sourceY={Math.floor(startY+partHeight*row)}
              isPlaying={isPlaying}
            />
          )
        })}
      </div>
    )
  }
  
  const updateCanvases=()=>{
    if (videoRef.current.currentTime>=duration) {
      videoRef.current.pause();
      videoRef.current.currentTime=0;
      onEnded();
      return false;
    }
    const ctx=bufferRef.current.getContext('2d', { alpha: false });
    ctx.drawImage(videoRef.current,0,0)
      for (const canvas of canvasCollectionRef.current) {
        canvas.draw()
      }
    return true;
  }
  
  //Start video and start canvas draw loop when isPlaying prop is set to true
  useEffect(()=>{
    
    if (videoRef && isPlaying) {
      videoRef.current.play()
      const update=()=>{
        
        if (updateCanvases())
          window.requestAnimationFrame(()=>update())
      }
      update();
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
      <canvas 
        
        hidden
        width={width}
        height={height}
        ref={bufferRef}
      />
      {canvasCollection()}
      
    </>
  )
  
}

export default VideoPlayer;