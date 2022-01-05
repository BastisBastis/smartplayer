import videoLow from "./starwars.mp4"

import bas from "./audio/bas.mp3"
import cel from './audio/cel.mp3'
import flj from "./audio/flj.mp3"
import kla from "./audio/kla1.mp3"
import pia from "./audio/pia.mp3"
import sax from "./audio/sax.mp3"
import klo from "./audio/slg.mp3"
import trb from "./audio/trb.mp3"
import trp from "./audio/trp.mp3"
import sla from "./audio/tru.mp3"
import val from "./audio/vhn.mp3"
import vio from "./audio/vln.mp3"

const StarwarsPaths = {
  video:{
    low:videoLow,
    high:null
  },
  videoRate:0.955,
  audioDelay:0.2,
  duration:58.2,
  audio:[
    {title:"Trombon",src:trb},
    {title:"Valthorn",src:val},
    {title:"Klarinett",src:kla},
    {title:"Klockspel",src:klo},
    {title:"Trumpet",src:trp},
    {title:"Saxofon",src:sax},
    {title:"Elbas",src:bas},
    {title:"Cello",src:cel},
    {title:"Slagverk",src:sla},
    {title:"Fiol",src:vio},
    {title:"Tvärflöjt",src:flj},
    {title:"Piano",src:pia}
  ]
}

export default StarwarsPaths;