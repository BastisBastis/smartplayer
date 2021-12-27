const yMargin = 20;
const xMargin = 20;
var thumbnailHeight=Math.floor(window.innerHeight/10);
var controlsHeight;
var mainHeight;
var mainY;

var videoIsPlaying = false;

const animationDuration=600;
const hiddenWidth="20px";
const hiddenHeight="20px";
const thumbnails = [];
const mainVideos = [];

const DISPLAY_TYPE_HIDDEN = 0;
const DISPLAY_TYPE_THUMBNAIL = 1;
const DISPLAY_TYPE_MAIN = 2;

var itemsToLoad;
var loadedItems;

var dbg=0;

var rtime;
var resizeTimeout = false;
var resizeDelta = 200;

//const margin = 4;
const margin = 0;

const useThumbnails = false;

$(window).resize(function() {
  rtime = new Date();
  if (resizeTimeout === false) {
    resizeTimeout = true;
    setTimeout(resizeend, resizeDelta);
  }
});

function resizeend() {
  if (new Date() - rtime < resizeDelta) {
    setTimeout(resizeend, resizeDelta);
  } else {
    resizeTimeout = false;
    controlsHeight= $("#controls").height();
    mainY = controlsHeight+thumbnailHeight+yMargin;
    mainHeight = window.innerHeight-mainY-yMargin;
    if (v && videoIsPlaying) {
      v.layoutMain();
      v.layoutThumbs();

    }
  }               
}

class VideoMixer {
  constructor ({url, 
                rows=1, 
                columns=1, 
                parts=1,
                partWidth,
                partHeight,
                width,
                height,
                title,
                partNames,
                audioFiles,
                audioFolder,
                startY=0,
                startX=0,
                audioDelay = 0,
                videoRate=1,
                frameMargin = 0,
                duration

               }) {

    let loadingDiv =document.createElement("div");
    $(loadingDiv).attr("id","loadingDiv").addClass("loadingDiv bgClr3").appendTo("body");
    let loadingBar =document.createElement("div");
    $(loadingBar).attr("id","loadingBar").addClass("loadingBar bgClr1").appendTo(loadingDiv);


    itemsToLoad=1;
    for (let file of audioFiles)
      if (file)
        itemsToLoad++;
    loadedItems=0;



    var self = this; //cache
    this.paused = false;

    this.audioDelay = audioDelay || 0.0;

    this.video = document.createElement('video');
    //this.video.playbackRate=videoRate;
    $(this.video).appendTo("body");
    $(this.video).attr({"src":url,
                        "playsinline":true,
                        "webkit-playsinline":true,
                        "hidden":true
                       }).prop("muted",true);


    this.controls=[];

    for (let i=0 ;i<parts; i++) {
      let btn = document.createElement("button");
      btn.innerHTML=partNames[i];

      $(btn).addClass("bgClr3");
      $(btn).appendTo("#controls");
      $(btn).click(() => {
        self.togglePart(i);
        adjustVol(i);
        self.toggleBtn(btn, i);
      });
      this.controls.push(btn);
    }

    this.hideControls = false;

    //Find and set max button 

    let maxButtonWidth = 0;
    for (let btn of this.controls)
      maxButtonWidth = Math.max(maxButtonWidth, $(btn).width());
    for (let btn of this.controls)
      $(btn).width(maxButtonWidth);

    controlsHeight= $("#controls").height();
    mainY = controlsHeight+thumbnailHeight+yMargin;
    mainHeight = window.innerHeight-mainY-yMargin;

    //Toggle controls button
    $("#toggleMenuBtn").click(()=>{ 
      $("#controls").slideToggle(animationDuration);
      if (this.hideControls)
        $("#toggleMenuBtn").html("&uarr;");
      else
        $("#toggleMenuBtn").html("&darr;");

      this.hideControls=!this.hideControls;
      this.layoutThumbs();
      this.layoutMain();
    });
    
    $("#pauseBtn").click(()=>{
    	this.togglePause();
    });
    


    this.parts=[];
    for (let i = 0; i<parts; i++) {
      let part = {};
      part.width=partWidth || Math.floor(width/columns);
      part.height=partHeight || Math.floor(height/rows);
      part.ratio = part.width/part.height;

      part.homeX = $(this.controls[i]).offset().left+ $(this.controls[i]).width();///2;
      part.homeY = 0//$(this.controls[i]).offset().top + $(this.controls[i]).height()/2;

      part.canvas = document.createElement("canvas");
      $(part.canvas).attr({"width":Math.floor(part.width),
                           "height":Math.floor(part.height)
                          }).css({"background-color":"#000",
                                  "width":hiddenWidth,
                                  "height":hiddenHeight,
                                  "left":part.homeX+"px",
                                  "top":part.homeY+"px",
                                  "opacity":0
                                 });
      $(part.canvas).appendTo("body");

      part.sourceX=Math.floor((i%columns)*part.width+startX);
      part.sourceY=Math.min(Math.floor((Math.floor(i/columns))*part.height+startY), Math.floor(height-part.height));

      //alert(part.sourceY);
      part.ctx= part.canvas.getContext("2d");
      part.displayType=DISPLAY_TYPE_HIDDEN;
      this.parts.push(part);
    }

    this.video.addEventListener('loadedmetadata', () => {


      //console.log("metadata");
      this.itemLoaded();
    });

    this.video.addEventListener('play', () => {
      this.duration = duration || this.video.duration;
      this.video.playbackRate = videoRate;
      videoIsPlaying = true;
      playAudio();
      this.showAll();
      
      const syncFix = () => {
        if (!self.video.paused && !self.video.ended) {
          if (Math.abs(this.video.currentTime/this.video.playbackRate - channels[0].seek() + this.audioDelay) > 0.05) {

            this.video.currentTime = (channels[0].seek() - this.audioDelay)*this.video.playbackRate;
            console.log("Repaired sync");
          }
          setTimeout(syncFix, 5000);
        }
      }
      
      const initialSyncFix = ()=> {
        if (this.video.currentTime && (this.video.currentTime/this.video.playbackRate)>Math.abs(this.audioDelay)) {
          for (let ch of channels) {
            if (ch)
              ch.seek(this.video.currentTime/this.video.playbackRate+this.audioDelay);
          }
          //console.log(channels[0].seek()+" "+this.video.currentTime);
          //console.log("Hmm");
          //Set up continuous syncFix
          setTimeout(syncFix, 5000);
        }
        else {
          setTimeout(initialSyncFix,100);
        }
      };
      initialSyncFix();

      


      (function loop() {
        if (!self.video.paused && !self.video.ended) {
          if (self.video.currentTime > self.duration) {
            self.stop();
          }

          for (let i=0;i<self.parts.length; i++) {
            let p=self.parts[i];
            p.ctx.drawImage(
              self.video,
              p.sourceX,
              p.sourceY+frameMargin,
              p.width,
              p.height-frameMargin*2,
              0,
              0,
              p.width+3,
              p.height+1
              );
            
          }
          setTimeout(loop, 1000 / 60); // drawing at 60fps

        }
      })();
    }, 0);

    //this.audioMixer = new AudioMixer(audioFolder, audioFiles, this.itemLoaded);
    loadAudio(audioFolder, audioFiles, (() => {this.itemLoaded();}));

  }

  itemLoaded() {
    loadedItems++;
    let done = loadedItems/itemsToLoad;
    let percent = Math.floor(done*100)+"%";
    $("#loadingBar").css({"width":percent});
    if (loadedItems>=itemsToLoad) {

      //console.log(ctx);
      $("#loadingDiv").remove();
      //$("#start").show();
      this.start();
      //$("#controls").css({"opacity":"1"});

    }
  }

  start() {
    for (let part of this.parts) {
      $(part.canvas).show();
    }
    $("#toggleMenuBtn").attr({"hidden":false});
    //$("#pauseBtn").attr({"hidden":false});
    $("#start").hide();
    $("#instructions").hide();
    $("#controls").animate({"opacity":1});

    this.video.play();
  }

  stop() {
    for (let part of this.parts) {
      $(part.canvas).hide();
    }
    stopAudio();
    this.video.pause();
    this.video.currentTime=0.0;
    $("#restartButton").show();
  }
  
  pause() {
    this.paused = true;
  	pauseAudio(); 
    this.video.pause();
  }
  
  unpause() {
    this.paused = false;
  	this.video.play();
    playAudio();
  }
  
  togglePause() {
  	if (this.paused)
      this.unpause();
    else
      this.pause();
  }

  restart() {
    resetVolumes();
    $("#restartButton").hide();
    this.start();

    playAudio();


  }

  showAll() {

    thumbnails.splice(0,thumbnails.length);
    for (let p of this.parts) {
      p.displayType=DISPLAY_TYPE_MAIN;
      if (!mainVideos.includes(p))
        mainVideos.push(p);
    }
    for (let i in this.controls) {
      let btn = this.controls[i];
      this.toggleBtn(btn,i,"bgClr3");
    }
    //alert(1);
    this.layoutMain();
    //alert(2);
  }

  toggleBtn (btn, i, className) {

    if (i<this.parts.length) {
      const btnClasses = ["bgClr1", "bgClr2", "bgClr3"];
      btn.className=className || btnClasses[this.parts[i].displayType];
    }

  }

  togglePart(i) {
    let part = this.parts[i];

    if (useThumbnails) {
      if (part.displayType === DISPLAY_TYPE_HIDDEN) {
        part.displayType = DISPLAY_TYPE_MAIN;
        mainVideos.push(part);
        this.layoutMain();
      }
      else if (part.displayType === DISPLAY_TYPE_MAIN) {
        for (let i in mainVideos) {
          if (mainVideos[i]===part)
            mainVideos.splice(i,1);
        }
        thumbnails.push(part);
        part.displayType = DISPLAY_TYPE_THUMBNAIL;
        this.layoutThumbs();
        this.layoutMain();
      }
      else if (part.displayType === DISPLAY_TYPE_THUMBNAIL) {
        for (let i in thumbnails) {
          if (thumbnails[i]===part)
            thumbnails.splice(i,1);
        }
        part.displayType=DISPLAY_TYPE_HIDDEN;
        $(part.canvas).animate({"width":hiddenWidth,
                                "height":hiddenHeight,
                                "left":part.homeX+"px",
                                "top":part.homeY+"px",
                                "opacity":0},
                               animationDuration);
        this.layoutThumbs();

        //alert(part.displayType);
      }
    }
    else
    {
      if (part.displayType === DISPLAY_TYPE_HIDDEN) {
        part.displayType = DISPLAY_TYPE_MAIN;
        mainVideos.push(part);
        this.layoutMain();
      }
      else {
        for (let i in mainVideos) {
          if (mainVideos[i]===part)
            mainVideos.splice(i,1);
        }
        part.displayType=DISPLAY_TYPE_HIDDEN;
        $(part.canvas).animate({"width":hiddenWidth,
                                "height":hiddenHeight,
                                "left":part.homeX+"px",
                                "top":part.homeY+"px",
                                "opacity":0},
                               animationDuration);
        this.layoutMain();
      }

    }

  }

  getOptimalRows(items,ratio) {
    const maxRows=8;
    let bestWidth=0;
    let bestRows;
    const totalWidth = window.innerWidth;
    const totalHeight = (this.hideControls? mainHeight+controlsHeight : mainHeight);
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

  layoutMain() {

    if (mainVideos.length>0) {

      //let rows = this.displayRows[mainVideos.length];
      const rows= this.getOptimalRows(mainVideos.length,mainVideos[0].ratio);
      let cols = Math.ceil(mainVideos.length/rows);
      //alert(rows);

      let w = Math.floor((window.innerWidth-xMargin*2)/cols);
      let h = Math.floor(w/mainVideos[0].ratio);
      if (h*rows > (this.hideControls? mainHeight+controlsHeight : mainHeight)) {
        h= (this.hideControls? mainHeight+controlsHeight : mainHeight)/rows;
        w = Math.floor(h*mainVideos[0].ratio);
      }

      if (window.innerWidth > $(this.video).width()) {

        w = Math.floor(Math.min($(this.video).width()*0.75,w));
        h = Math.floor(w/mainVideos[0].ratio);
      }


      let rowWidths=[];
      for (let i = 0;i<rows; i++){
        if (i<rows-1)
        {
          //alert(1);
          rowWidths.push(cols*w);
        }
        else
        {
          //alert();
          rowWidths.push((mainVideos.length%cols===0 ? cols*w : (mainVideos.length%cols)*w));
        }
      }
      //alert(rowWidths.length);
      //alert(cols);
      //alert(rowWidths[rowWidths.length-1]);
      for (let i in mainVideos) {
        let y = mainY + Math.floor(i/cols)*h;

        if (this.hideControls) y-= controlsHeight;
        let x = (window.innerWidth/2)-rowWidths[Math.floor(i/cols)]/2+(i%cols)*w;
        //alert(x);
        let p = mainVideos[i];

        $(p.canvas).animate({"width":w+"px", 
                             "height":h+"px",
                             "top":y,
                             "left":x,
                             "opacity":1},
                            animationDuration);


      }
    }

  }

  layoutThumbs () {
    if (thumbnails.length>0) {
      //let maxWidth = (window.innerWidth-xMargin*2)/thumbnails.length;

      let maxWidth = ($("#toggleMenuBtn").offset().left-$("#toggleMenuBtn").width()-xMargin*2)/thumbnails.length;

      let h = maxWidth/thumbnails[0].ratio;
      let w = maxWidth;
      if (h > thumbnailHeight) {
        h = thumbnailHeight;
        w= h*thumbnails[0].ratio;
      }
      let y = controlsHeight;
      if (this.hideControls) y-= controlsHeight;


      //total thumbnailWidth
      let totalWidth = w*thumbnails.length;
      let center = window.innerWidth/2;
      let thumbsLeftX= Math.floor(center-totalWidth/2);
      for (let i in thumbnails) {
        let p = thumbnails[i];
        let x = thumbsLeftX+i*w;
        $(p.canvas).animate({"width":w+"px", 
                             "height":h+"px",
                             "top":y,
                             "left":x,
                             "opacity":0.5},
                            animationDuration);
      }
    }
  }

}