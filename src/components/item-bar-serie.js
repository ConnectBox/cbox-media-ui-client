import React, { useState, useEffect } from 'react'
import ItemBar from './item-bar.js'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import useMediaPlayer from '../hooks/useMediaPlayer'

const ItemBarSerie = ({serie, title, descr, useIcon, bkgrd, onClick}) => {
  const { isPaused, curPlay } = useMediaPlayer()
  const [serieCurEp, setSerieCurEp] = useState(undefined)
  const [curEpInx, setCurEpInx] = useState(undefined)
  const [nbrOfEp, setNbrOfEp] = useState(undefined)
  const [percentVal, setPercentVal] = useState(undefined)
  const [epDescr, setEpDescr] = useState(undefined)
  useEffect(() => {
    let didCancel = false
    if (serie){
      if (serie.fileList!=null) {
        if ((serie.fileList.length>1) && (!didCancel)) {
          setNbrOfEp(serie.fileList.length)
        }
      }
      if (curPlay && (curPlay.curSerie===serie) && (curPlay.curEp!=null)){
        setSerieCurEp(curPlay.curEp)
      } else {
        let tmpEp = undefined
        apiObjGetStorage({curSerie: serie},"curEp").then((value) => {
          if (!didCancel) {
            if ((serie!=null) && (serie.fileList!=null)
                && (value!=null)
                && (serie.fileList[value]!=null)) {
              tmpEp=serie.fileList[value]
              setCurEpInx(value)
            }
            setSerieCurEp(tmpEp)
          }
        }).catch(function(err) {
          console.error(err)
        })
      }
    }
    return () => {
      didCancel = true
    }
  }, [serie,curPlay])
  useEffect(() => {
    if (nbrOfEp!=null && curEpInx!=null) {
      setPercentVal((curEpInx>0)? curEpInx*100/nbrOfEp : undefined)
    }
  }, [nbrOfEp,curEpInx])
  useEffect(() => {
    const subtitleStyle = {
      whiteSpace: 'unset',
      textOverflow: 'clip',
      backgroundColor: 'rgba(0,0,0,0.3)',
    }
    if (serieCurEp!=null && nbrOfEp>1) {
      let tempEpDescr = serieCurEp.id+1
      if (serieCurEp.title!=null) {
        tempEpDescr = serieCurEp.title
      }
      setEpDescr(<div style={subtitleStyle}><br/>{tempEpDescr}</div>)
    }
  }, [serieCurEp,nbrOfEp])
  const handleClick = (ev, idStr) => {
    ev.stopPropagation()
    if (onClick!=null) {
      onClick(ev)
    }
  }
  return (
    <ItemBar
      title={title}
      descr={epDescr}
      useIcon={useIcon}
      bkgrd={bkgrd}
      percentVal={percentVal}
      onClick={(e) => handleClick(e)}
    />
  )
}

export default ItemBarSerie
