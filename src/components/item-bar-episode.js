import React, { useState, useEffect } from 'react'
import ItemBar from './item-bar.js'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import useMediaPlayer from '../hooks/useMediaPlayer'

const calcPercent = (dur) => (dur.position * 100 / dur.duration)

const ItemBarEpisode = ({serie, episode, title, descr, useIcon, bkgrd, onClick}) => {
  const { isPaused, curPlay, curPos } = useMediaPlayer()
  const [mSec, setMSec] = useState(undefined)
  const [mSecDur, setMSecDur] = useState(undefined)
  const restorePos = async (obj) => {
    await apiObjGetStorage(obj,"mSec").then((value) => {
      if (value==null){
        value=0
      }
      setMSec(value)
    }).catch((err) => {
      console.error(err)
    })
    apiObjGetStorage(obj,"mSecDur").then((dur) => {
      setMSecDur(dur)
    }).catch((err) => {
      console.error(err)
    })
  }
  useEffect(() => {
    if ((serie!=null) && (episode!=null)){
      restorePos({curSerie: serie, curEp: episode})
    }
  },[serie,episode])

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
    const resetPosMargin = 10000 // Reset playing to begining if less mSec remains
    ev.stopPropagation()
    if (onClick!=null) {
      if ((mSec!=null) && (mSecDur!=null) && ((mSecDur-mSec-resetPosMargin)<0)){
        apiObjSetStorage({curSerie: serie, curEp: episode},"mSec",0).then(() => {
          onClick(ev)
        }).catch(function(err) {
          console.error(err)
        })
      } else {
        onClick(ev)
      }
    }
  }
  let percentVal = undefined
  const isActive = false
  if (isActive && (curPos!=null)) {
    percentVal = calcPercent(curPos)
  } else if (mSec && mSecDur) {
    percentVal = (mSec * 100 / mSecDur)
  }
  return (
    <ItemBar
      title={title}
      descr={descr}
      useIcon={useIcon}
      bkgrd={bkgrd}
      percentVal={percentVal}
      onClick={(e) => handleClick(e)}
    />
  )
}

export default ItemBarEpisode
