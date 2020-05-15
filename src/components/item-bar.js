import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import LinearProgress from '@material-ui/core/LinearProgress'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import useMediaPlayer from '../hooks/useMediaPlayer'
import useLibrary from '../hooks/useLibrary'
import { menuList } from './cbox-menu-list'

const useStyles = makeStyles(theme => ({
  titleBar: {
    alignItems: 'flex-end',
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  subtitle: {
    whiteSpace: 'unset',
    paddingBottom: 5,
  },
  title: {
    whiteSpace: 'unset',
    textOverflow: 'clip',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playPause: {
    color: 'white',
  },
  bar: {
    backgroundColor: 'red',
  },
  linearProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
}))
//    backgroundColor: 'rgba(44,135,213,0.4)',

const calcPercent = (dur) => (dur.position * 100 / dur.duration)
const ItemProgressBar = ({classes,value}) => (
  <LinearProgress
    variant="determinate"
    classes={{
      root: classes.linearProgressBar,
      bar: classes.bar,
    }}
    value={value}/>
)
const PlayButton = ({useIcon,bkgrd,classes,onClick}) => (
  <IconButton
    size="small"
    className={classes.playPause}
    style={{backgroundColor: bkgrd}}
    onClick={onClick}>
    {useIcon || <PlayArrow/>}
  </IconButton>
)
const PauseButton = ({useIcon,bkgrd,classes,onClick}) => (
  <IconButton
    size="small"
    className={classes.playPause}
    style={{backgroundColor: bkgrd}}
    onClick={onClick}>
    {useIcon || <Pause/>}
  </IconButton>
)

const ItemBar = ({item, useIcon, bkgrd, showDescr, fullDescr, onClick}) => {
  const classes = useStyles()
//  const [mSec, setMSec] = useState(undefined)
//  const [mSecDur, setMSecDur] = useState(undefined)
  const subtitleStyle = {
    whiteSpace: 'unset',
    textOverflow: 'clip',
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
  let itemTitle = ""
  let idStr = ""
  let itemDescr = <br/>
  if (item!=null){
    idStr = item.id
    itemTitle = item.title
    if (item.descr!=null) {
      let tempItemDescr = item.descr
      if (item.fullDescr && fullDescr) tempItemDescr = item.fullDescr
      itemDescr = <div style={subtitleStyle}><br/>{tempItemDescr}</div>
    }
    if (itemTitle==null){
      itemTitle = idStr+1
    }
  }
  if (!showDescr) itemDescr = undefined
  let percentVal = 0
/*
  if (isActive && (curPos!=null)){
    percentVal = calcPercent(curPos)
  } else if (partOfCurList){
    percentVal = (mSec * 100 / mSecDur)
  }
*/
  const partOfCurList = true
  const isActive = false
  const isPaused = false
  return (
    <GridListTileBar
      title={itemTitle}
      subtitle={(<div>{(partOfCurList || isActive)
            && (<ItemProgressBar classes={classes} value={percentVal}/>)}{itemDescr}</div>)}
      classes={{
        root: classes.titleBar,
        title: classes.title,
        subtitle: classes.subtitle,
      }}
      actionIcon={
      ((isPaused)||(!isActive))
       ?(<PlayButton useIcon={useIcon} classes={classes} bkgrd={bkgrd} onClick={(e) => onClick(e)}/>
      ):(<PauseButton useIcon={useIcon} classes={classes} bkgrd={bkgrd} onClick={(e) => onClick(e)}/>
      )}
    />
  )
}

export default ItemBar
