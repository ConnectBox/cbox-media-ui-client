import React, {useState,useEffect} from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import EpList from './ep-list'
import ItemImage from './item-image'
import ItemBar from './item-bar'
import InfoTileItem from './info-tile-item'
import { menuList } from './cbox-menu-list'
import { getImgOfObj } from '../utils/obj-functions'
import { apiObjGetStorage } from '../utils/api'
import useBrowserData from '../hooks/useBrowserData'
import useMediaPlayer from "../hooks/useMediaPlayer"

const TileItem = (props) => {
  const {item,infoTile,useIcon,epList,expanded} = props
  const {width, height} = useBrowserData()
  const {curPlay} = useMediaPlayer()
  const [serieCurEp, setSerieCurEp] = useState(undefined)
  const [percentVal, setPercentVal] = useState(undefined)
  const [nbrOfEp,setNbrOfEp] = useState(undefined)
  const [curEpInx,setCurEpInx] = useState(undefined)
  const [epDescr, setEpDescr] = useState(undefined)
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
  useEffect(() => {
    let didCancel = false
    if (item){
// ToDo: Change this to use the "id" field here instead of the "title"
      if (curPlay && (curPlay.curSerie.title===item.title) && (curPlay.curEp!=null)){
        setSerieCurEp(curPlay.curEp)
      } else {
        if (item.fileList!=null) {
          if ((item.fileList.length>1) && (!didCancel)) {
            setNbrOfEp(item.fileList.length)
          }
        }
        let tmpEp = undefined
        apiObjGetStorage({curSerie: item},"curEp").then((value) => {
          if (!didCancel) {
            if ((item!=null) && (item.fileList!=null)
                 && (value!=null)
                 && (item.fileList[value]!=null)) {
              tmpEp=item.fileList[value]
              setCurEpInx(value)
            }
            setSerieCurEp(tmpEp)
          }
        }).catch((err) => console.error(err))
      }
    }
    return () => {
      didCancel = true
    }
  }, [item,curPlay])
  return (
  <div onClick={(e) => (!infoTile) && props.onClick(e)}>
    {!infoTile && (
      <ItemImage
        item={item}
        curEp={serieCurEp}
        onClick={(e) => props.onClick(e)}
        width={"100%"}
        float={"left"}
      />
    )}
    {infoTile ? (
      <InfoTileItem
        item={item}
        curEp={serieCurEp}
        expandIcon={expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
        onClickClose={(e) => props.onClickClose(e)}
        onClickDownload={(e) => props.onClickDownload(e)}
        onClickPlay={(e) => props.onClickPlay(e)}
        onClickEdit={(e) => props.onClickEdit(e)}
        onClickExpand={(e) => props.onClickExpand(e)}
      />
    ) : (
      <ItemBar
        title={item.title}
        descr={epDescr}
        percentVal={percentVal}
        bkgrd={item.mediaType ? menuList[item.mediaType].bkgrd : "lightgrey"}
        useIcon={useIcon}
        onClick={(e) => props.onClickPlay(e)}/>
    )}
    {infoTile && expanded && epList
    && (<EpList
      epList={epList}
      multiRow
      onClick={(ev,ser,ep) => console.log(ep)}
      serie={item}
      isPaused={false}
      useHeight={height}
      width={width}
      useIcon={useIcon}
      imgSrc={getImgOfObj(item)}/>)}
  </div>
  )
}

export default TileItem
