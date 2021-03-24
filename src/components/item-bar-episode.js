import React, { useState, useEffect } from 'react'
import ItemBar from './item-bar.js'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import useMediaPlayer from '../hooks/useMediaPlayer'

const calcPercent = (dur) => (dur.position * 100 / dur.duration)

const ItemBarEpisode = ({serie, episode, title, descr, useIcon, bkgrd, onClick}) => {
  const { curPos } = useMediaPlayer()
  const [mSec, setMSec] = useState(undefined)
  const [mSecDur, setMSecDur] = useState(undefined)
  useEffect(() => {
    let didCancel = false
    const restorePos = async (obj) => {
      await apiObjGetStorage(obj,"mSec").then((value) => {
        if (value==null)value=0
        if (!didCancel) setMSec(value)
      }).catch((err) => console.error(err))
      await apiObjGetStorage(obj,"mSecDur").then((dur) => {
        if (!didCancel) setMSecDur(dur)
      }).catch((err) => console.error(err))
    }
    if ((serie!=null) && (episode!=null)){
      restorePos({curSerie: serie, curEp: episode})
    }
    return () => didCancel = true
  },[serie,episode])
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
