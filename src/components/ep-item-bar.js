import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import AvPlay from '@material-ui/icons/PlayArrow'
import AvPause from '@material-ui/icons/Pause'
import LinearProgress from '@material-ui/core/LinearProgress'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import useMediaPlayer from "../hooks/useMediaPlayer"

const useStyles = makeStyles(theme => ({
  titleBar: {
    alignItems: 'flex-end',
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  subtitle: {
    whiteSpace: 'unset',
  },
  title: {
    whiteSpace: 'unset',
    textOverflow: 'clip',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playPause: {
    backgroundColor: 'rgba(44,135,213,0.4)',
    color: 'grey',
  },
  bar: {
    backgroundColor: 'red',
  },
  linearProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
}))

const calcPercent = (dur) => (dur.position * 100 / dur.duration)
const classes = useStyles()

const EpItemProgressBar = ({value}) => (
  <LinearProgress
    variant="determinate"
    classes={{
      root: classes.linearProgressBar,
      bar: classes.bar,
    }}
    value={value} />
)

const PlayButton = ({onClick}) => (
  <IconButton
    className={classes.playPause}
    onClick={onClick}
  >
    <AvPlay/>
  </IconButton>
)

const PauseButton = ({onClick}) => (
  <IconButton
    className={classes.playPause}
    onClick={onClick}
  >
    <AvPause/>
  </IconButton>
)

const EpItemBar = (props) => {
  const { isPaused, curPlay, curPos } = useMediaPlayer()
  const [mSec, setMSec] = useState(undefined)
  const [mSecDur, setMSecDur] = useState(undefined)
  const {episode,serie} = props

  const restoreCurEp = (obj) => {
    let tmpEp = undefined
    const tmpObj = {curSerie: obj}
    apiObjGetStorage(usbHash,tmpObj,"curEp").then((value) => {
      if (value==null){
        value=0
      }
      if ((obj!=null) && (obj.fileList!=null)
          && (obj.fileList[value]!=null)){
        tmpEp=obj.fileList[value]
      }
      setSerieCurEp(tmpEp)
    }).catch(function(err) {
      console.error(err)
    })
  }

  useEffect(() => {
    if ((episode)&&(serie)){
      if (curPlay && (curPlay.curSerie===serie) && (curPlay.curEp!=null)){
      } else {
        restoreCurEp(serie)
      }
    }
  }, [serie,episode,curPlay])

/*
  componentWillReceiveProps = (nextProps) => {
    const {episode,serie,curPos} = nextProps
    if ((episode!=null) && (serie!=null)){
      if (episode!==this.props.episode){
        this.restoreCurPos({curSerie: serie, curEp: episode})
      } else if (this.props.isActive
                  && (curPos!=null)
                  && (curPos.position!==this.props.position)
                  && (curPos.position!==this.state.mSec)){
        this.setState({mSec: curPos.position, mSecDur: curPos.duration})
      }
    }
  }
*/

  const handleClick = (ev, idStr) => {
    const { usbHash } = props
    const resetPosMargin = 10000 // Reset playing to begining if less mSec remains
    ev.stopPropagation()
    if (props.onClickPlay!=null) {
      const {episode,serie} = props
      if ((mSec!=null) && (mSecDur!=null) && ((mSecDur-mSec-resetPosMargin)<0)){
        apiObjSetStorage(usbHash,{curSerie: serie, curEp: episode},"mSec",0).then(() => {
          props.onClickPlay(idStr)
        }).catch(function(err) {
          console.error(err)
        })
      } else {
        props.onClickPlay(idStr)
      }
    }
  }

  const { isActive, partOfCurList, episode, onSetPaused } = props
  const subtitleStyle = {
    whiteSpace: 'unset',
    textOverflow: 'clip',
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
  let epTitle = ""
  let idStr = ""
  let epDescr = <br/>
  if (episode!=null){
    idStr = episode.id
    epTitle = episode.title
    if (episode.descr!=null) {
      epDescr = <div style={subtitleStyle}><br/>{episode.descr}</div>
    }
    if (epTitle==null){
      epTitle = idStr+1
    }
  }
  let percentVal = 0
  if (isActive && (curPos!=null)){
    percentVal = calcPercent(curPos)
  } else if (partOfCurList){
    percentVal = (mSec * 100 / mSecDur)
  }
  return (
    <GridListTileBar
      title={epTitle}
      subtitle={(<div>{(partOfCurList || isActive)
            && (<EpItemProgressBar
                  value={percentVal}
                  classes={classes}
                />)}{epDescr}</div>)}
      classes={{
        root: classes.titleBar,
        title: classes.title,
        subtitle: classes.subtitle,
      }}
      actionIcon={
      ((isPaused)||(!isActive))
       ?(<PlayButton
           classes={classes}
           onClick={(isActive)? onSetPaused :(e) => handleClick(e,idStr)}
         />
      ):(<PauseButton
          classes={classes}
          onClick={(isActive)? onSetPaused :(e) => handleClick(e,idStr)}
         />
      )}
    />
  )
}

export default EpItemBar
