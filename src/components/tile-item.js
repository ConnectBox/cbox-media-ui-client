import React, {useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import EpList from './ep-list'
import ItemImage from './item-image'
import ItemBarSerie from './item-bar-serie'
import InfoTileItem from './info-tile-item'
import { menuList } from './cbox-menu-list'
import { arrayInsert, getImgOfObj } from '../utils/obj-functions'
import { apiObjGetStorage } from '../utils/api'
import useBrowserData from '../hooks/useBrowserData'
import useMediaPlayer from "../hooks/useMediaPlayer"
import useSettings from "../hooks/useSettings"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 768,
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#111',
    paddingTop: 70,
  },
  cardContent: {
    backgroundColor: '#111',
    overflow: 'hidden',
    padding: 0,
    width: '100%',
  },
  cardContentMulti: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: 0,
    width: '100%',
  },
  headline: {
    paddingTop: 15,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  areaHeadline: {
    paddingTop: 20,
    paddingLeft: 10,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.87)',
    width: '100%',
  },
  iconButton: {
    color: 'white',
  },
  floatingButton: {
    margin: 0,
    color: 'white',
    left: '75%',
    top: 'auto',
    right: 'auto',
    zIndex: 100,
    position: 'relative',
  },
  image: {
//    height: '100%',
    width: '100%',
    float: 'left',
  },
  imageLessSize: {
    height: '30%',
    width: '20%',
    top: '15%',
  },
  gridListMulti: {
  },
  gridList: {
    overflowY: 'hidden',
    // Promote the list into its own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  showTileRoot: {
//    height: '100%',
    height: 'auto !important',
    backgroundColor: 'red',
  },
  infoTileRoot: {
    height: 'auto !important',
  },
  tileRoot: {
    height: 'auto !important',
    background:
      'linear-gradient(to bottom, rgba(16,26,56,0.9) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  tileRootSmall: {
  },
  tileRootRed: {
    height: 'auto !important',
    backgroundColor: 'red',
  },
  tileRootRedSmall: {
    backgroundColor: 'red',
  },
}))

const TileItem = (props) => {
  const classes = useStyles()
  const {item,inx,infoTile,useIcon,epList,expanded} = props
  const {size, width, height} = useBrowserData()
  const { isPaused, curPlay } = useMediaPlayer()
  const [serieCurEp, setSerieCurEp] = useState(undefined)
  useEffect(() => {
    let didCancel = false
    if (item){
      if (curPlay && (curPlay.curSerie===item) && (curPlay.curEp!=null)){
        setSerieCurEp(curPlay.curEp)
      } else {
        let tmpEp = undefined
        apiObjGetStorage({curSerie: item},"curEp").then((value) => {
          if (value==null){
            value=0
          }
          if ((item!=null) && (item.fileList!=null)
              && (item.fileList[value]!=null)){
            tmpEp=item.fileList[value]
          }
          if (!didCancel) {
            setSerieCurEp(tmpEp)
          }
        }).catch((err) => console.error(err))
      }
    }
    return () => {
      didCancel = true
    }
  }, [item])
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
        onClickExpand={(e) => props.onClickExpand(e)}
      />
    ) : (
      <ItemBarSerie
        serie={item}
        curEp={serieCurEp}
        bkgrd={item.mediaType ? menuList[item.mediaType].bkgrd : "lightgrey"}
        useIcon={useIcon}
        title={item.title}
        onClick={(e) => props.onClickPlay(e)}/>
    )}
    {infoTile && expanded && epList
    && (<EpList
      title={item.title}
      epList={epList}
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
