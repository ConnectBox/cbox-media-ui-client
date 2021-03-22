import React, { useState  } from 'react'
import { apiSetStorage, apiObjGetStorage, apiObjSetStorage } from './utils/api'
import { unique } from 'shorthash'

const MediaPlayerContext = React.createContext([{}, () => {}])
const MediaPlayerProvider = ({children}) => {
  const [state, setState] = useState({
    currentTrackIndex: null,
    isPlaying: false,
  })
  const [isPaused, setIsPaused] = useState(false)
  const setStateKeyVal = (key,val) => setState(state => ({ ...state, [key]: val }))

  const togglePlay = () => {
//    state.isPlaying ? player.pause() : player.play()
    setStateKeyVal( "isPlaying", !state.isPlaying )
  }

  const skipToNextTrack = () => {
//    playTrack(newIndex)
  }

  const onFinishedPlaying = () => {
console.log("onFinishedPlaying")
    const {curSerie, curEp} = state.curPlay
console.log(curSerie)
    if (curSerie){
      if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)
          && (curEp!=null)){
        // This serie has episodes
        let epInx = curEp.id
        epInx+=1
        let newPlayObj = {curSerie}
        apiObjSetStorage(newPlayObj,"curEp",epInx)
        if (curSerie.fileList[epInx]!=null){
          newPlayObj.curEp=curSerie.fileList[epInx]
        }
        setStateKeyVal( "curPlay", newPlayObj)
      }
    }
  }

  const onStopPlaying = () => {
    setStateKeyVal( "curPlay", undefined )
    setStateKeyVal( "curSerie", undefined )
    setStateKeyVal( "curEp", undefined )
  }

  const onPlaying = (curPos) => {
    setStateKeyVal( "curPos", curPos )
  }

  const updateStorage = async (idStr,val) => {
    await apiSetStorage(idStr,val)
  }

  const startPlay = async (inx,curSerie,curEp) => {
console.log(inx)
console.log(curSerie)
console.log(curEp)
    if (!curSerie){ // stop playing
      let newPlayObj
      setStateKeyVal( "curPlay", newPlayObj)
    } else {
      let tmpEp = curEp
      if ((!tmpEp) && (curSerie.fileList!=null)
          && (curSerie.fileList[inx]!=null)){
        tmpEp=curSerie.fileList[inx]
      }
      const epubFound = ((curSerie)&&(curSerie.mediaType==="epub"))
      const pdfFound = ((curSerie)&&(curSerie.mediaType==="pdf"))
      const htmlFound = ((curSerie)&&(curSerie.mediaType==="html"))
      if (pdfFound) {
        if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)){
          tmpEp = curSerie.fileList[0]
        }
      } else if (htmlFound) {
        if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)){
          tmpEp = curSerie.fileList[0]
        }
      } else if (epubFound) {
        if (curEp!=null) {
          let newPlayObj = {curSerie}
          setStateKeyVal( "curPlay", newPlayObj)
          apiObjSetStorage({curSerie},"curEp",curEp.id)
        } else if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)) {
          let newPlayObj = {curSerie}
          tmpEp = curSerie.fileList[0]
          apiObjGetStorage(newPlayObj,"curEp").then((value) => {
            if ((value==null)||(curSerie.fileList[value]==null)){
              value=0
              apiObjSetStorage(newPlayObj,"curEp",0)
            }
            if (curSerie.fileList[value]!=null){
              newPlayObj.curEp=curSerie.fileList[value]
              tmpEp=curSerie.fileList[value]
            }
            setStateKeyVal( "curPlay", newPlayObj)
          }).catch((err) => {
            console.error(err)
          })
        }
      }
      // This serie has episodes
      let newPlayObj = {curSerie,curEp}
      if (curEp!=null){
//          props.onStartPlay && props.onStartPlay(curSerie,curEp)
        await apiObjSetStorage({curSerie},"curEp",curEp.id)
        setStateKeyVal( "curPlay", newPlayObj)
      } else {
        apiObjGetStorage(newPlayObj,"curEp").then((value) => {
          if ((value==null)||(curSerie.fileList[value]==null)){
            value=0
            apiObjSetStorage(newPlayObj,"curEp",0)
          }
          if (curSerie.fileList[value]!=null){
            newPlayObj.curEp=curSerie.fileList[value]
          }
//            props.onStartPlay && props.onStartPlay(curSerie,curSerie.fileList[value])
          setStateKeyVal( "curPlay", newPlayObj)
        }).catch((err) => {
          console.error(err)
        })
      }
      const curSerId = unique(curSerie.title)
// navHist is not yet fully implemented
//      const navHist = {...state.navHist, [curSerId]: epIdStr}
//      await updateStorage("navHist",navHist)
      await updateStorage("curSerId",curSerId)
//      setState(state => ({...state, navHist,  curSerId, curSerie, curEp: tmpEp}))
      setState(state => ({...state, curSerId, curSerie, curEp: tmpEp}))
    }
  }

  const handlerFunctions = {
    startPlay,
    togglePlay,
    onStopPlaying,
    onPlaying,
    onFinishedPlaying,
    isPaused,
    setIsPaused,
    curPlay: state.curPlay,
    curSerie: state.curSerie,
    curPos: state.curPos,
    skipToNextTrack,
  }
  return (
    <MediaPlayerContext.Provider value={[state, setState, handlerFunctions]}>
      {children}
    </MediaPlayerContext.Provider>
  )
}

//viewLibrary,

export {MediaPlayerContext, MediaPlayerProvider}
