import React, { useState, useEffect, useContext } from 'react'
import Fab from '@material-ui/core/Fab'
import NavClose from '@material-ui/icons/Close'
import { PlayerInfo } from '../components/player-info.js'
// import Sound from 'react-sound'
// BUG FIX !!!
// Temporary bug fix for react-sound version 1.1.0
import Sound from './sound.js'
// import SoundCloud from './sound-cloud'
import Dialog from '@material-ui/core/Dialog'
import useMediaPlayer from "../hooks/useMediaPlayer"
import useBrowserData from '../hooks/useBrowserData'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import CboxVideoPlayer from './cbox-video'
import CboxEpubPlayer from './cbox-epub'
import CboxReadOutLoud from './cbox-read-out-loud'
import CboxTrainingPlayer from './cbox-training'
import { freeAudioIdOsisMap } from '../osisFreeAudiobible'
import { audiobibleOsisId, osisIdAudiobibleTitle } from '../osisAudiobibleId'
import { getLocalMediaFName, isEmptyObj, pad } from '../utils/obj-functions'
import { PDFViewer } from '../components/pdf-viewer'

let styles = {
  floatingButton: {
    margin: 0,
    bottom: 330,
    left: 610,
    position: 'fixed',
    right: 'auto',
    zIndex: 1000,
  },
  footerFullsize: {
    height: '100%',
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    margin: 0,
    zIndex: 3,
    fontSize: 18,
  },
  footerVideo: {
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    margin: 0,
    zIndex: 3,
    fontSize: 18,
  },
  footer: {
    display: 'block',
    zIndex: 3,
    fontSize: 18,
    height: 64,
    position: 'fixed',
    right: 0,
    left: 0,
    paddingLeft: 64,
    bottom: 0,
    margin: 0,
    cursor: 'pointer'
  },
}

/*
<Footer
  isWaitingForPlayInfo={isWaitingForPlayInfo}
  onSetPaused={handleSetPaused}
  onStopPlaying={handleStopPlaying}
  />
*/
const Footer = () => {
  const {width, height} = useBrowserData()
  const player = useMediaPlayer()
  const {isPlaying, currentTrackName, togglePlay, pdfDoc, curPlay,
          onStopPlaying, setIsPaused, onPlaying, onFinishedPlaying,
          playPreviousTrack, playNextTrack,
          isPaused, isWaitingForPlayInfo} = player
  let tmpPlay = player.curPlay
  if (!tmpPlay) tmpPlay = {curSerie: undefined, curEp: undefined}
  const {curSerie,curEp} = tmpPlay
  const curEpInx = 0
  if (curSerie && curSerie.epList && curEpInx) {
//    curEp = curSerie.epList[curEpInx-1]
  }
  const [hasFinishedPlay, setHasFinishedPlay] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [curMsPos, setCurMsPos] = useState(undefined)
  const [pagePos, setPagePos] = useState(undefined)
  const [locPos, setLocPos] = useState(undefined)
  const [curPos, setCurPos] = useState()
  const [curDur, setCurDur] = useState()
  const storePos = (msPos) => apiObjSetStorage(curPlay,"mSec",msPos)
  const storePagePos = (msPos) => apiObjSetStorage(curPlay,"page",msPos)
  const storeLocPos = (msPos) => apiObjSetStorage(curPlay,"loc",msPos)
  const restorePos = async (obj) => {
    await apiObjGetStorage(obj,"mSec").then((value) => {
      if (value==null){
        value=0
      }
      if ((obj!=null)&&(obj.curSerie!=null)&&(obj.curSerie.fileList!=null)
          &&(obj.curEp!=null)&&((obj.curSerie.fileList.length-1)===obj.curEp.id)){
        apiObjGetStorage(obj,"mSecDur").then((dur) => {
          const marginSec = 3 // minimum sec for play - else repeat from beginning
          if (value+(marginSec*1000)>dur){
            value = 0
          }
          setStartPos(value)
          setCurMsPos(value)
        })
      } else {
        setStartPos(value)
        setCurMsPos(value)
      }
    }).catch((err) => {
      console.error(err)
    })
  }
  const restorePage = async (obj) => {
    await apiObjGetStorage(obj,"page").then((value) => {
      setPagePos(value||1)
    }).catch((err) => {
      console.error(err)
    })
  }
  const restoreLoc = async (obj) => {
    await apiObjGetStorage(obj,"loc").then((value) => {
      setLocPos(value||'epubcfi(/6/2[cover]!/6)')
    }).catch((err) => {
      console.error(err)
    })
  }
  useEffect(() => {
    if (curPlay!=null){
      setHasFinishedPlay(false)
      if (curPlay.curSerie && curPlay.curSerie.mediaType==="pdf") {
        restorePage(curPlay)
      } else if (curPlay.curSerie && curPlay.curSerie.mediaType==="epub") {
        restoreLoc(curPlay)
      } else {
        restorePos(curPlay)
      }
    }
  },[curPlay,curEp])
/*
  componentWillReceiveProps = (nextProps) => {
    const {curPlay} = nextProps
    if ( (curPlay!=null)
        && ((curPlay==null)
          || (curPlay.curEp !== curPlay.curEp))){
      if ((curPlay!=null)
          && (curPlay.curEp!=null)){ // Store current position
        storePos(state.curMsPos)
      }
      setState({hasFinishedPlay: false})
      restorePos(curPlay)
    }
*/

  const closeFooter = () => {
console.log(curMsPos)
    storePos(curMsPos)
    setPagePos(undefined)
    if (onStopPlaying) onStopPlaying()
  }

  const movePos = (percent) => {
    if (percent!=null){
      let newPos = 0
      if (curDur!=null){
        newPos = Math.floor(percent * curDur / 100) // Divide by 100 in order to get promille - i.e. milliseconds
      }
      setHasFinishedPlay(false)
      setStartPos(newPos)
      setCurMsPos(newPos)
    }
  }

  const handleStop = () => setHasFinishedPlay(false)
  const handleSetPaused = (isPaused) => {
console.log("handleSetPaused")
    setIsPaused(isPaused)
    if (!isPaused) setHasFinishedPlay(false)
  }

  const handleLoading = (cur) => {
    if (curDur !== cur.duration){
      apiObjSetStorage(curPlay,"mSecDur",cur.duration)
      setCurDur(cur.duration)
    }
  }

  const updatePos = (cur) => {
    const newPos = Math.floor(cur.position / 1000)
    if (curPos !== newPos) {
      storePos(cur.position)
    }
    if (curDur !== cur.duration){
      apiObjSetStorage(curPlay,"mSecDur",cur.duration)
      setCurMsPos(cur.position)
      setCurPos(newPos)
      setCurDur(cur.duration)
    } else {
      setCurMsPos(cur.position)
      setCurPos(newPos)
    }
  }

  const handlePlaying = (cur) => {
// BUG FIX !!!
    const soundPlayerBugFix = hasFinishedPlay
    if (!soundPlayerBugFix){
      updatePos(cur)
      if (onPlaying) onPlaying(cur)
    }
  }

  const handleVideoDuration = (dur) => {
    const durMSec = dur * 1000
    apiObjSetStorage(curPlay,"mSecDur",durMSec)
    setCurDur(durMSec)
  }

  const handleVideoProgress = (pos) => {
    const posMSec = pos.playedSeconds *1000
    storePos(posMSec)
    setCurMsPos(posMSec)
    setCurPos(posMSec)
    if (onPlaying){
      const cur = {position: posMSec, duration: curDur}
      onPlaying(cur)
    }
  }

  const handlePageProgress = (page) => {
    storePagePos(page)
  }

  const handleLocationProgress = (loc) => {
console.log(loc)
    storeLocPos(loc)
  }

  const handleFinishedVideoPlaying = () => {
    if (onFinishedPlaying) onFinishedPlaying()
  }

  const handleFinishedPlaying = () => {
console.log("handleFinishedPlaying")
    setHasFinishedPlay(true)
    handleFinishedVideoPlaying()
  }
  const onClose = () => {
    closeFooter()
  }

  const topMargin = 60

  const getPatternContent = (part,bk,chStr) => {
    if (part===1) return audiobibleOsisId[bk]
    else if (part===2) return osisIdAudiobibleTitle[bk]
    else if (part===3) return chStr
    return part
  }

  let curHeight = Math.trunc(width*9/16)
  if (curHeight>height-topMargin){
    curHeight = height-topMargin
  }

  let useSec
  let useDur
  let downloadName
  if (curMsPos!=null) useSec = Math.floor(curMsPos / 1000)
  if (curDur!=null) useDur = Math.floor(curDur / 1000)
  let locURL = ""
  let locPath = ""
  let videoFound = false
  let epubFound = false
  let pdfFound = false
  let htmlFound = false
  let bibleFound = false
  let curPlayState = Sound.status.PLAYING
  const btnStyle =  Object.assign({}, styles.floatingButton)
  let idStr = "footer"
  let readOutLoud = false
  if (isPaused) {
    curPlayState = Sound.status.PAUSED
  }
  if ((curPlay!=null)) {
    let bibleObj
    if ((curEp!=null)&&(curEp.bibleType)) {
      bibleObj = curEp
    }
    if ((curEp!=null)&&(curEp.filename!=null)) {
      locURL = curEp.filename
    } else if ((curSerie!=null)&&(curSerie.curPath!=null)) {
      locURL = curSerie.URL
    }
//    locPath = getLocalMediaFName(locURL)
    locPath = locURL
console.log(locPath)
    const typeFound = (type) => {
      if (curEp && curEp.mediaType) return curEp.mediaType===type
      return (curSerie &&(curSerie.mediaType===type))
    }
    epubFound = typeFound("epub")
    pdfFound = typeFound("pdf")
//    htmlFound = typeFound("html") || typeFound("pdf")
    htmlFound = typeFound("html")
    videoFound = typeFound("vid")
    bibleFound = typeFound("bible")

    if (bibleFound) {
      locURL = ""
      if (!isEmptyObj(bibleObj)){
        const {bk,id} = bibleObj
        let idStr = pad(id)
        let curFName
        if (curSerie.freeType) {
          if ((bk==="Ps") && (id<100)){
            idStr = "0" +pad(id)
          }
          curFName = curSerie.curPath + "/"
                            + freeAudioIdOsisMap[bk] + idStr + ".mp3"
        } else {
          curFName = curSerie.curPath + "/"
          curSerie.pathPattern && curSerie.pathPattern.forEach(part => {
            curFName += getPatternContent(part,bk,idStr)
          })
        }
        locURL = curFName
        locPath = getLocalMediaFName(locURL)
      }
    } else if (epubFound || htmlFound) {
      readOutLoud = curSerie.readOL
    }
  }
  if (epubFound || htmlFound) {
    if (width!=null) {
      btnStyle.left = (width-40)
    }
    btnStyle.top = 70
    btnStyle.width = 30
    btnStyle.height = 30
  } else if (pdfFound){
    if (width!=null) {
      btnStyle.left = (width-100)
    }
    btnStyle.top = 70
    btnStyle.width = 30
    btnStyle.height = 30
  } else if (videoFound){
    if (width!=null) {
      btnStyle.left = (width-40)
    }
    btnStyle.bottom = (curHeight-20)
    btnStyle.width = 30
    btnStyle.height = 30
  }
  if (videoFound){
    idStr = "footer-video"
  } else if (epubFound || htmlFound) {
    idStr = "footer-epub"
  }
  const fullSizeFound = videoFound || readOutLoud || htmlFound || epubFound || pdfFound
  const position = epubFound ? 'absolute' : 'relative'
  const top = readOutLoud ? '40px' : '0px'
  if (locURL.length>0) {
    return (
      <footer
        id={idStr}
        style={videoFound ? styles.footerVideo : fullSizeFound ? styles.footerFullsize : styles.footer}>
        <Dialog
          disableBackdropClick
          onClose={onClose}
          open={(pdfFound && pagePos)}
        >
          <Fab
            size="small"
            onClick={onClose}
            style={btnStyle}
          >
            <NavClose />
          </Fab>
          <PDFViewer
            url={locPath}
            onProgress={handlePageProgress}
            startPage={pagePos}/>
        </Dialog>
        {fullSizeFound ? (
          <div style={{position, top: epubFound ? topMargin : top, height: '80%', width: '100%'}}>
            <Fab
              size="small"
              onClick={closeFooter}
              style={btnStyle}
            >
              <NavClose />
            </Fab>
            {videoFound ? (
              <CboxVideoPlayer
                url={locPath}
                fullSize={fullSizeFound}
                isPaused={isPaused}
                playFromPosition={startPos}
                onEnded={handleFinishedVideoPlaying}
                onDuration={handleVideoDuration}
                onProgress={handleVideoProgress}
                width={width}
                height={curHeight}
                playing
                controls />
            ): htmlFound ? (
              <CboxTrainingPlayer
                url={locPath}
                height={height-topMargin}
              />
            ): readOutLoud ? (
              <CboxReadOutLoud
                url={locPath}
                height={height-topMargin}
                onProgress={handleLocationProgress}
                location={'/6/2!/4/2/2'}
              />
            ): epubFound && locPos && (
              <CboxEpubPlayer
                url={locPath}
                onProgress={handleLocationProgress}
                location={locPos}
              />
            )}
          </div>
        ):(
          <div>
            <Sound
              url={locPath}
              autoPlay
              playStatus={curPlayState}
              playFromPosition={startPos}
              onLoading={handleLoading}
              onPlaying={handlePlaying}
              onStop={handleStop}
              onFinishedPlaying={handleFinishedPlaying} />
            <PlayerInfo
              containerWidth={width}
              curSec={useSec}
              curDur={useDur}
              isPaused={isPaused}
              isWaitingForPlayInfo={isWaitingForPlayInfo}
              episode={curPlay.curEp}
              serie={curPlay.curSerie}
              onSetPaused={handleSetPaused}
              url={locPath}
              downloadName={downloadName}
              onMovePosCallback={movePos}
              onCloseCallback={closeFooter} />
          </div>
        )}
      </footer>
    )
  } else {
     return (
       <footer id="footer" style={{display: 'none' }}>
       </footer>
    )
  }

}

/*
{videoFound ? (
  <VideoPlayer
    url={locPath}
    fullSize={fullSizeFound}
    isPaused={isPaused}
    playFromPosition={startPos}
    onEnded={handleFinishedVideoPlaying}
    onDuration={handleVideoDuration}
    onProgress={handleVideoProgress}
    width={width}
    height={curHeight}
    playing
    controls />
): (htmlFound || readOutLoud || epubFound) && (
  <CboxPreview
    url={locURL}
    height={height-topMargin}
    onFinishedPlaying={closeFooter}
  />
)}

*/

export const MediaPlayer = (props) => {
  const [isWaitingForPlayInfo, setIsWaitingForPlayInfo] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [curCheckPos, setCurCheckPos] = useState(undefined)
  const [curPos, setCurPos] = useState()
  const player = useMediaPlayer()
  const {curSerie, curEp, usbStr} = player
  useEffect(() => {
    let curPlay = {curSerie,curEp}
  },[curSerie,curEp])

/*
  const handleStartPlay = (inx,curSerie,curEp) => {
    setIsPaused(false)
    setIsWaitingForPlayInfo(true)
    setCurCheckPos(undefined)
  }
*/

  const handlePlaying = (cur) => {
    if ((cur!=null) && (cur.position!=null)
      && isWaitingForPlayInfo){
      if (cur.position!==curCheckPos){
        setCurCheckPos(cur.position)
        setIsWaitingForPlayInfo(false)
      } else {
        setCurCheckPos(cur.position)
      }
    }
    const {curSerie} = props
    if ((curSerie!=null)&&(curSerie.nextLevelPos!=null)){
console.log(cur)
      if (cur.position-(curSerie.nextLevelPos*1000)>=cur.duration){
        if (props.onEndOfLevel!=null) props.onEndOfLevel()
      }
    }
    setCurPos(cur)
  }

  const handleStopPlaying = () => {
    player.onStopPlaying()
    setIsPaused(false)
    setIsWaitingForPlayInfo(false)
    setCurCheckPos(undefined)
    if (props.onStopPlaying) props.onStopPlaying()
  }

  return (
      <Footer
        curSerie={curSerie}
        curEp={curEp}
        isPaused={isPaused}
        isWaitingForPlayInfo={isWaitingForPlayInfo}
        curPos={curPos}
        onSetPaused={(isPaused) => setIsPaused(isPaused)}
        onPlaying={handlePlaying}
        onFinishedPlaying={() => props.onFinishedPlaying()}
        onStopPlaying={handleStopPlaying}
      />
  )
}

/*
<LangPage
  language={curLang}
  curLangData={langData[curLang]}
/>
*/
export default MediaPlayer
