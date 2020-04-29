import React, { useState, useEffect, useContext } from 'react'
import { apiSetStorage, apiGetStorage,
          apiObjGetStorage, apiObjSetStorage } from './utils/api'
import { unique } from 'shorthash'
import { getLocalMediaFName, isEmptyObj, pad } from './utils/obj-functions'
import { readFileAsync, getHostPathSep } from './utils/file-functions'

const MediaPlayerContext = React.createContext([{}, () => {}])
const MediaPlayerProvider = ({children}) => {
  const [state, setState] = useState({
    currentTrackIndex: null,
    isPlaying: false,
  })
  const [curPlay, setCurPlay] = useState({
                                            curSerie: undefined,
                                            curEp: undefined,
                                          })
  const [curLang, setCurLang] = useState('eng')
  const [isPaused, setIsPaused] = useState(false)
  const [isWaitingForPlayInfo, setWaiting] = useState(false)
  const [hasFinishedPlay, setHasFinishedPlay] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [curMsPos, setCurMsPos] = useState(undefined)
  const [curPos, setCurPos] = useState()
  const [curDur, setCurDur] = useState()
  const storePos = (msPos) => apiObjSetStorage(curPlay,"mSec",msPos)
  const usbHash = "dummy"
  const setStateKeyVal = (key,val) => setState(state => ({ ...state, [key]: val }))
  const restorePos = async obj => {
    await apiObjGetStorage(obj,"mSec").then((value) => {
      let useVal = value || 0
      if ((obj!=null)&&(obj.curSerie!=null)&&(obj.curSerie.fileList!=null)
          &&(obj.curEp!=null)&&((obj.curSerie.fileList.length-1)===obj.curEp.id)){
        apiObjGetStorage(obj,"mSecDur").then((dur) => {
          const marginSec = 3 // minimum sec for play - else repeat from beginning
          if (useVal+(marginSec*1000)>dur) useVal = 0
          setStartPos(useVal)
          setCurMsPos(useVal)
        })
      } else {
        setStartPos(useVal)
        setCurMsPos(useVal)
      }
    }).catch(err => {
      console.error(err)
    })
  }

  /*
    useEffect(() => {
      setState(state => ({ ...state, isPaused: true }))
    },[])
  */
    useEffect(() => {
      if (curPlay!=null){
        setHasFinishedPlay(false)
        restorePos(curPlay)
      }
    },[curPlay])
    const getSerie = async () => {
      const ser = await apiGetStorage("curSerie")
  //    setCurSerie(ser || undefined)
    }
  //  useEffect(() => {getSerie()}, [])

  /*
  useEffect(() => {
    if (serie!=null){
      if ((curPlay!=null) && (curPlay.curSerie===serie) && (curPlay.curEp!=null)){
        setSerieCurEp(curPlay.curEp)
      } else if (curPlay!=null){
        if ((curPlay.curSerie===serie)
            && ((serieCurEp==null)
                || (curPlay.curEp.id>serieCurEp.id))){
          setSerieCurEp(curPlay.curEp)
        }
      } else {
        restoreCurEp(serie)
      }
    }
  },[serie,curPlay])
  const isCurPlaying = ((serie != null)
                        && (curPlay!=null)
                        && (curPlay.curSerie!=null)
                        && (serie === curPlay.curSerie))

  */

  const getEpItem = (ser,epIdStr) => {
    let retArr = ser.fileList && ser.fileList.filter(ep => epIdStr===unique(ep.title))
    return retArr && retArr.length>0 && retArr[0]
  }

  const togglePlay = () => {
//    state.isPlaying ? player.pause() : player.play()
    setStateKeyVal( "isPlaying", !state.isPlaying )
  }

  const playPreviousTrack = () => {
    const newIndex = ((state.currentTrackIndex + -1) % state.tracks.length + state.tracks.length) % state.tracks.length
//    playTrack(newIndex)
  }

  const skipToNextTrack = () => {
    const newIndex = (state.currentTrackIndex + 1) % state.tracks.length
//    playTrack(newIndex)
  }

  const updateLang = (lang) => {
    setCurLang(lang)
  }

  const handleLangChange = (ev) => {
    setCurLang(ev.target.value)
    apiSetStorage("curLang",ev.target.value)
  }
  const handleSetPaused = (isPaused) => {
    setIsPaused(isPaused)
  }
  const onStopPlaying = () => {
    setStateKeyVal( "curPlay", undefined )
    setStateKeyVal( "curSerie", undefined )
    setStateKeyVal( "curEp", undefined )
  }

  const updateStorage = async (idStr,val) => {
    await apiSetStorage(idStr,val)
  }

  const startPlay = async (inx,curSerie,curEp,isBibleClose) => {
console.log(inx)
console.log(curSerie)
console.log(curEp)
    if (!curSerie){ // stop playing
      let newPlayObj
      if (isBibleClose) {
        newPlayObj = {...curPlay}
        newPlayObj.curEp = undefined
        newPlayObj.bibleObj = undefined
      }
      setStateKeyVal( "curPlay", newPlayObj)
//      props.onStartPlay && props.onStartPlay(undefined,undefined)
    } else {
      let tmpEp = curEp
      if ((!tmpEp) && (curSerie.fileList!=null)
          && (curSerie.fileList[inx]!=null)){
        tmpEp=curSerie.fileList[inx]
      }
console.log(tmpEp)
      const epubFound = ((curSerie)&&(curSerie.mediaType==="epub"))
      const pdfFound = ((curSerie)&&(curSerie.mediaType==="pdf"))
      const htmlFound = ((curSerie)&&(curSerie.mediaType==="html"))
      const bibleEpFound = ((curEp)&&(curEp.bibleType))
      if (pdfFound) {
        if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)){
          tmpEp = curSerie.fileList[0]
        }
        const tempPath = tmpEp.filename
/*
        const pdfDoc = await readFileAsync(tempPath, "base64")
        setStateKeyVal( "pdfDoc", pdfDoc )
*/        
      } else if (htmlFound) {
        if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)){
          tmpEp = curSerie.fileList[0]
//          window.ipcRendererSend('open-new-window',
//                                  getLocalMediaFName(tmpEp.filename))
        }
      } else if (epubFound) {
        if (curEp!=null) {
          let newPlayObj = {curSerie}
          setStateKeyVal( "curPlay", newPlayObj)
          apiObjSetStorage({curSerie},"curEp",curEp.id)
//          window.ipcRendererSend('open-new-window',
//                                getLocalMediaFName(curEp.filename))
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
//            window.ipcRendererSend('open-new-window',
//                                    getLocalMediaFName(tmpEp.filename))

          }).catch((err) => {
            console.error(err)
          })
        }
      }
      if (!bibleEpFound && ((curSerie.fileList==null) || (curSerie.fileList.length<=0))){
        // No episodes
        setStateKeyVal( "curPlay", {curSerie})
      } else {
        // This serie has episodes
        let newPlayObj = {curSerie,curEp}
        if (bibleEpFound){
          newPlayObj.bibleObj = {...curEp}
        }
        if (curEp!=null){
//          props.onStartPlay && props.onStartPlay(curSerie,curEp)
          setStateKeyVal( "curPlay", newPlayObj)
          apiObjSetStorage({curSerie},"curEp",curEp.id)
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
      }
      const curSerId = unique(curSerie.title)
      let epIdStr = "unknown"
      if (tmpEp) {
        if (tmpEp.title) epIdStr = unique(tmpEp.title)
        if (tmpEp.id) epIdStr = tmpEp.id
      }
      const navHist = {...state.navHist, [curSerId]: epIdStr}
      await updateStorage("navHist",navHist)
      await updateStorage("curSerId",curSerId)
console.log(tmpEp)
console.log(state)
console.log(curSerie)
      setState(state => ({...state, navHist,  curSerId, curSerie, curEp: tmpEp}))
    }
  }

/*
  const handleMediaPlaying = (cur) => {
      const curPos = Math.floor(cur.position / 1000)
      const curDur = Math.floor(cur.duration / 1000)
      if ((curPos !== curPos) || (props.curDur !== curDur)) {
        setCurPos(curPos)
        setCurDur(curDur)
        setCur(cur)
      }
  }

  const handlePlayNext = () => {
console.log("playNext")
    const {curSerie, curEp, bibleObj} = curPlay
    if (curSerie.mediaType==="bible"){
      let newPlayObj
      if (curEp.id<chInBook[curEp.bk]){
        const newEp = {...curEp,id: curEp.id+1 }
        const newBibleObj = {...bibleObj,id: bibleObj.id+1 }
        newPlayObj = {...curPlay, curEp: newEp, bibleObj: newBibleObj}
      } else if (curEp.bk!=="Rev") {
// ToDo
      }
      setCurPlay(newPlayObj)
      setCur(undefined)
    } else if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)
        && (curEp!=null)){
      // This serie has episodes
      let epInx = curEp.id
      epInx+=1
      let newPlayObj = {curSerie}
      apiObjSetStorage(newPlayObj,"curEp",epInx)
      if (curSerie.fileList[epInx]!=null){
        newPlayObj.curEp=curSerie.fileList[epInx]
      }
      setCurPlay(newPlayObj)
      setCur(undefined)
    }
  }

  const handleStartPlay = (inx,curSerie,curEp,isBibleClose) => {
    if (curSerie==null){ // stop playing
      let newPlayObj
      if (isBibleClose) {
        newPlayObj = {...curPlay}
        newPlayObj.curEp = undefined
        newPlayObj.bibleObj = undefined
      }
      setCurPlay(newPlayObj)
      props.onStartPlay && props.onStartPlay(undefined,undefined)
    } else {
      const epubFound = ((curSerie!=null)&&(curSerie.mediaType==="epub"))
      const htmlFound = ((curSerie!=null)&&(curSerie.mediaType==="html"))
      const bibleEpFound = ((curEp!=null)&&(curEp.bibleType))
      if (htmlFound) {
        if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)){
          const tmpEp = curSerie.fileList[0]
          window.ipcRendererSend('open-new-window',
                                  getLocalMediaFName(tmpEp.filename))
        }
      } else if (epubFound) {
        if (curEp!=null) {
          let newPlayObj = {curSerie}
          setCurPlay(newPlayObj)
          apiObjSetStorage({curSerie},"curEp",curEp.id)
          window.ipcRendererSend('open-new-window',
                                getLocalMediaFName(curEp.filename))
        } else if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)) {
          let newPlayObj = {curSerie}
          let tmpEp = curSerie.fileList[0]
          apiObjGetStorage(newPlayObj,"curEp").then((value) => {
            if ((value==null)||(curSerie.fileList[value]==null)){
              value=0
              apiObjSetStorage(newPlayObj,"curEp",0)
            }
            if (curSerie.fileList[value]!=null){
              newPlayObj.curEp=curSerie.fileList[value]
              tmpEp=curSerie.fileList[value]
            }
            setCurPlay(newPlayObj)
            window.ipcRendererSend('open-new-window',
                                    getLocalMediaFName(tmpEp.filename))

          }).catch((err) => {
            console.error(err)
          })
        }
      }
      if (!bibleEpFound && ((curSerie.fileList==null) || (curSerie.fileList.length<=0))){
        // No episodes
        setCurPlay({curSerie})
      } else {
        // This serie has episodes
        let newPlayObj = {curSerie,curEp}
        if (bibleEpFound){
          newPlayObj.bibleObj = {...curEp}
        }
        if (curEp!=null){
          props.onStartPlay && props.onStartPlay(curSerie,curEp)
          setCurPlay(newPlayObj)
          apiObjSetStorage({curSerie},"curEp",curEp.id)
        } else {
          apiObjGetStorage(newPlayObj,"curEp").then((value) => {
            if ((value==null)||(curSerie.fileList[value]==nulurll)){
              value=0
              apiObjSetStorage(newPlayObj,"curEp",0)
            }
            if (curSerie.fileList[value]!=null){
              newPlayObj.curEp=curSerie.fileList[value]
            }
            props.onStartPlay && props.onStartPlay(curSerie,curSerie.fileList[value])
            setCurPlay(newPlayObj)
          }).catch((err) => {
            console.error(err)
          })
        }
      }
    }
  }

    state = {
      isPaused: false,
      isWaitingForPlayInfo: false,
      curCheckPos: undefined,
    }

    handleFinishedPlaying = () => {
      this.props.onPlayNext()
    }

    handleStopPlaying = () => {
      this.props.onStartPlay(undefined)
      this.setState({
        isPaused: false,
        curCheckPos: undefined,
        isWaitingForPlayInfo: false
      })
    }

    handleStartPlay = (inx,curSerie,curEp) => {
      this.setState({
        isPaused: false,
        curCheckPos: undefined,
        isWaitingForPlayInfo: true
      })
      this.props.onStartPlay(inx,curSerie,curEp)
    }

    handlePlaying = (cur) => {
      if ((cur!=null) && (cur.position!=null)
        && this.state.isWaitingForPlayInfo){
    console.log(cur)
        if (cur.position!==this.state.curCheckPos){
          this.setState({
            curCheckPos: cur.position,
            isWaitingForPlayInfo: false
          })
        } else {
          this.setState({curCheckPos: cur.position})
        }
      }
      this.props.onPlaying(cur)
    }

    handleSetPaused = (isPaused) => {
      this.setState({isPaused})
    }


  isPaused={isPaused}
  onSetPaused={this.props.onSetPaused}
  onPlayNext={this.props.onPlayNext}
  curView={curView}
  curPlay={curPlay}
  curPos={curPos}

  curSer: state.curSer,
  curEp: state.curEp,
  isPlaying: state.isPlaying,

  */
  const handlerFunctions = {
    startPlay,
    togglePlay,
    onStopPlaying,
    isPaused,
    setIsPaused,
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
