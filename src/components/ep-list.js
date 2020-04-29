import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import AvPlay from '@material-ui/icons/PlayArrow'
import CloseIcon from '@material-ui/icons/Close'
import { getImgOfObj } from '../utils/obj-functions'
import ItemBar from './item-bar.js'
import {arrayRemove, arrayInsert} from '../utils/obj-functions'
import useBrowserData from '../hooks/useBrowserData'
import useMediaPlayer from "../hooks/useMediaPlayer"
import useSettings from "../hooks/useSettings"
import { useTranslation } from 'react-i18next'

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
    backgroundColor: 'black',
    bottom: 20,
    left: '85%',
    top: 'auto',
    right: 'auto',
    zIndex: 100,
    position: 'relative',
  },
  gridListMulti: {
  },
  gridList: {
    flexWrap: 'nowrap',
    overflow: 'scroll',
    overflowY: 'hidden',
    // Promote the list into its own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  image: {
    left: '50%',
    top: 0,
    width: 'auto',
    height: '100%',
    transform: 'translateX(-50%)',
    maxHeight: 200,
  },
  imageLessSize: {
    height: '30%',
    width: '20%',
    top: '15%',
  },
  showTileRoot: {
    height: '100%',
    backgroundColor: 'red',
  },
  infoTileRoot: {
    height: '100%',
  },
  tileRoot: {
    height: 'auto !important',
  },
  tileRootSmall: {
  },
  tileRootRed: {
    backgroundColor: 'red',
    height: 'auto !important',
  },
  tileRootRedSmall: {
    backgroundColor: 'red',
  },
}))

const EpList = (props) => {
  const { channel, fullList, filter, title, serie, navButton, multiRow, onClick,
          onSetPaused, onPlayNext, onAddTitle, onDelete,
          onSelectFromLibrary, onTitlesUpdate, epList, imgSrc } = props
  const [expanded,setExpanded] = useState(!navButton)
  const [showInfo,setShowInfo] = useState(undefined)
  const [lastInRow,setLastInRow] = useState(undefined)
  const {size, width, height, largeScreen} = useBrowserData()
  const settings = useSettings()
  const { titles, languages, myLang,
          featuredTitles, handleFeaturedTitlesUpdate } = settings
  const { playNext, startPlay, isPaused, setIsPaused,
          curView, curPlay, curPos } = useMediaPlayer()
  const { t } = useTranslation()
  const classes = useStyles()
  const [curSer, setCurSer] = useState(serie)
  const [serieCurEp, setSerieCurEp] = useState(undefined)
  const [curEditModeInx, setCurEditModeInx] = useState(undefined)
  const [curFilter, setCurFilter] = useState(undefined)
  const [anchorEl, setAnchorEl] = useState(null)
  const handlePlay = (ev,item) => {
    ev.stopPropagation()
    startPlay(0,item)
  }
  const handleCloseDetails = (ev) => {
    ev.stopPropagation()
    setShowInfo(undefined)
    setLastInRow(undefined)
  }
  const handleClick = (ev,idStr) => {
    setCurSer(undefined)
    setCurFilter(idStr)
  }
/*
  const { curEp, onClickPlay } = props;
  let epList = [];
  if ((serie!=null) && (serie.fileList!=null)) {
    epList = serie.fileList;
  }
  let curEpInx = 0;
  if (curEp!=null){
    curEpInx=curEp.id;
  }
  let tmpPlayEp = undefined;
  if (curPlay!=null){
    tmpPlayEp = curPlay.curEp;
  }
*/

  let curTitleList = []
  if (titles){
    if (fullList){
      languages.forEach(lang => {
        if (titles[lang]!=null){
          Object.keys(titles[lang]).forEach((title) => {
            curTitleList.push(titles[lang][title])
          })
        }
      })
    } else if ((titles)&&(featuredTitles)){
      Object.keys(featuredTitles).filter(
        lang => myLang.indexOf(lang)>=0
      ).forEach((lang) => {
        if (titles[lang]!=null){
          featuredTitles[lang].forEach((title) => {
            if (titles[lang][title]!=null){
              curTitleList.push(titles[lang][title])
            }
          })
        }
      })
    }
  }
  let useBkgrdColor = 'rgba(15, 4, 76, 0.68)'
  if (curFilter==="vid"){
    useBkgrdColor = 'rgba(255, 215, 0, 0.78)'
  } else if (curFilter==="epub"){
    useBkgrdColor = 'rgba(120, 215, 120, 0.78)'
  } else if (curFilter==="html"){
    useBkgrdColor = 'rgba(81, 184, 233, 0.68)'
  }
  const hasCurView = (curView!= null)
  let featuredStr = t("featured")
  if ((channel) && (channel.title)) {
    featuredStr = channel.title
  }
  let showListTitle = ((channel!=null) || (curTitleList.length>0))
  if (hasCurView) {
    showListTitle = false
  }

  let tmpPlaySer = undefined
  const sizeToCol = {"xl": 5, "lg": 4, "md": 3}
  let colSize = sizeToCol[size] || 2
  let curHeight = height-150
  if (width<=380){
    colSize = 1
    if (curHeight>300){
      curHeight = 300
    }
  }
  const subtitleStyle = {
    whiteSpace: 'unset',
    lineHeight: '1.2',
    marginTop: 10,
    marginLeft: 15,
    fontSize: '0.8rem',
    textOverflow: 'clip',
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
  const nbrOfEntries = epList && epList.length
  const maxEntries = (navButton && !expanded) ? colSize : nbrOfEntries
  const showNav = navButton && (nbrOfEntries > colSize)
  const showNavButton = showNav && !expanded
  const useColSize = colSize + (showNavButton ? 0.15 : 0.1)
  const showMulti = multiRow && expanded
  const expandIcon = expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>
  const toggleExpand = (ev) => {
    ev.stopPropagation()
    setExpanded(!expanded)
  }
  const setInfoInx = (ev,epInx,maxInx) => {
    ev.stopPropagation()
    const doEnable = epInx!==showInfo
    setShowInfo(doEnable ? epInx : undefined)
    const moduloVal = epInx % colSize
    const divVal = Math.trunc(epInx / colSize)
    let tmpLastInRow = ((divVal +1) * colSize) -1
    // Fix when last item is first in row
    if (tmpLastInRow>=maxInx) tmpLastInRow = maxInx -1
    setLastInRow(doEnable ? tmpLastInRow : undefined)
  }
  const handleClickItemIndex = (ev,item,index) => {
    var tmpEp = undefined
    ev.stopPropagation()
    if ((item!=null) && (item.fileList!=null)
        && (item.fileList[index]!=null)){
      tmpEp=item.fileList[index]
    }
    if (startPlay!=null) {
console.log(tmpEp)
//      setSerieCurEp(tmpEp)
      startPlay(index,item,tmpEp)
    }
  }
/*
{curIsSerie && showAllEp && (<IconButton
  className={classes.actionButton}
  onClick={handleCloseShowAllEp}><ExpandLessIcon/></IconButton>)}
{curIsSerie && !showAllEp && (<IconButton
  className={classes.actionButton}
  onClick={handleShowList}><ExpandMoreIcon/></IconButton>)}
*/
  const InfoTileItem = ({item,inx}) => {
    return (
      <div>
        <Typography style={subtitleStyle}>{item.description}</Typography>
        <IconButton className={classes.actionButton}><ExpandLessIcon/></IconButton>
        <IconButton className={classes.actionButton}><ExpandMoreIcon/></IconButton>
        <Fab color="primary" onClick={(ev) => handlePlay(ev,item)}><AvPlay /></Fab>
        <Fab color="primary" onClick={(ev) => handleCloseDetails(ev)}><CloseIcon /></Fab>
      </div>
    )
  }
  const embellishInfo = (arr) => {
    const newEp = {...arr[showInfo], id: lastInRow+"b"}
//    return (showInfo!=null) ? arrayInsert(arr,showInfo+1,newEp) : arr
    return (showInfo!=null) ? arrayInsert(arr,lastInRow+1,newEp) : arr
  }
    return (
      <CardContent className={(showMulti && !navButton) ? classes.cardContentMulti : classes.cardContent} >
        <Typography className={classes.areaHeadline} type="headline" component="h2">
          {title} {showNav && (<IconButton
            className={classes.iconButton}
            onClick={(ev) => toggleExpand(ev)}>{expandIcon}</IconButton>)}
        </Typography>
        <GridList
          className={multiRow ? classes.gridListMulti : classes.gridList}
          cols={useColSize}
        >
          {epList && embellishInfo(epList.slice(0,maxEntries)).map((ep,inx) => {
            const useImg = ep.image ? getImgOfObj(ep) : imgSrc
            const tileRootClass = (ep===tmpPlaySer) ? classes.tileRootRed : classes.tileRoot
            const tileRootClassSmall = (ep===tmpPlaySer) ?
                                          classes.tileRootRedSmall : classes.tileRootSmall
            const showTile = (inx===(showInfo))
            const infoTile = (inx===(lastInRow+1))
            return (
              <GridListTile
                key={ep.id}
                cols={infoTile ? colSize : 1}
                rows={infoTile ? 1.3 : 1}
                className={showTile ? classes.showTileRoot : infoTile ? classes.infoTileRoot : (width>=480) ? tileRootClass : tileRootClassSmall}
                onClick={(ev) => setInfoInx(ev,inx,maxEntries)}
              >
                {!infoTile && (<img
                  className={infoTile ? classes.imageLessSize : classes.image}
                  src={useImg}
                  alt={ep.title}
                  onClick={(ev) => setInfoInx(ev,inx,maxEntries)}
                />)}
                {infoTile ? <InfoTileItem item={ep} inx={inx}/>
                : <ItemBar item={ep} onClick={(ev) => onClick(ev,serie,ep)}/>}
              </GridListTile>
            )}
          )}
        </GridList>
        {showNavButton && (<Fab
          className={classes.floatingButton}
          onClick={(ev) => toggleExpand(ev)}>{expandIcon}</Fab>)}
      </CardContent>
    )
}

export default EpList
