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
import { Download } from 'mdi-material-ui'
import { getImgOfObj } from '../utils/obj-functions'
import EpList from './ep-list.js'
import ItemBar from './item-bar.js'
import Tappable from 'react-tappable'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddIcon from '@material-ui/icons/Add'
import { menuList } from './cbox-menu-list'
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
  actionButton: {
    color: 'lightgrey',
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
  buttonPlay: {
    margin: 20,
    color: 'white',
    zIndex: 100,
  },
  floatingButtonClose: {
    margin: 0,
    color: 'white',
    left: '92%',
    top: 'auto',
    zIndex: 100,
    backgroundColor: 'rgba(120, 120, 120, 0.5)',
    position: 'absolute',
  },
  gridListMulti: {
  },
  gridList: {
    overflowY: 'hidden',
    // Promote the list into its own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  infoImage: {
    height: 230,
    float: 'right',
  },
  image: {
//    height: '100%',
    width: '100%',
    float: 'left',
  },
  filler: {
    height: '100%',
    width: '100%',
  },
  imageLessSize: {
    height: '30%',
    width: '20%',
    top: '15%',
  },
  showTileRoot: {
//    height: '100%',
    height: 'auto !important',
    backgroundColor: 'red',
  },
  infoTileContent: {
    position: 'relative',
    width: '100%',
  },
  infoTileLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background:
      'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 100%)',
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

const ItemList = (props) => {
  const { channel, fullList, filter, title, serie, navButton, multiRow, onClick,
          onSetPaused, onPlayNext, onAddTitle, onDelete,
          onSelectFromLibrary, onTitlesUpdate } = props
  const [expanded,setExpanded] = useState(!navButton)
  const [showInfo,setShowInfo] = useState(undefined)
  const [showAllEp,setShowAllEp] = useState(false)
  const [lastInRow,setLastInRow] = useState(undefined)
  const {size, width, height, largeScreen} = useBrowserData()
  const settings = useSettings()
  const { titles, languages, myLang,
          featuredTitles, handleFeaturedTitlesUpdate } = settings
  const { playNext, startPlay, isPaused, setIsPaused,
          curView, curPlay, curPos } = useMediaPlayer()
  const { t } = useTranslation()
  const classes = useStyles()
  const [curSer, setCurSer] = useState(undefined)
  const [serieCurEp, setSerieCurEp] = useState(undefined)
  const [createNew, setCreateNew] = useState(true)
  const [curEditModeInx, setCurEditModeInx] = useState(undefined)
  const [openConfigDialogue, setOpenConfigDialogue] = useState(false)
  const [curFilter, setCurFilter] = useState(undefined)
  const [anchorEl, setAnchorEl] = useState(null)
  const handleSelectFromLibrary = () => onSelectFromLibrary && onSelectFromLibrary()
  const handleUpdate = (ser) => (action) => onTitlesUpdate && onTitlesUpdate(ser,action)
//  const handleSetEditMode = (isSet,inx) => setCurEditModeInx(isSet ? inx : undefined)
  const handleStartEdit = () => {
    setCreateNew(false)
    setOpenConfigDialogue(true)
  }
  const handleClose = () => setAnchorEl(null)
  const handleCloseDialog = () => {
    setOpenConfigDialogue(false)
    setCurEditModeInx(undefined)
  }
  const handleSetEditMode = (ev) => {
    ev.stopPropagation()
    handleStartEdit()
  }
  const handleDelete = (ev,item) => {
console.log(item)
    ev.stopPropagation()
    handleFeaturedTitlesUpdate(item,"delete")
  }
  const handlePlay = (ev,item) => {
    ev.stopPropagation()
    startPlay(0,item)
  }
  const handleDownload = (ev,item) => {
    ev.stopPropagation()
    console.log(item)
  }
  const handleCloseDetails = (ev) => {
    ev.stopPropagation()
    setShowInfo(undefined)
    setLastInRow(undefined)
  }
  const handleAddClick = (ev) => {
    setAnchorEl(ev.currentTarget)
  }
  const handleClick = (ev,idStr) => {
    setCurSer(undefined)
    setCreateNew(true)
    setOpenConfigDialogue(true)
    setAnchorEl(null)
    setCurFilter(idStr)
  }

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
  const nbrOfEntries = curTitleList && curTitleList.length
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
  const handleShowAllEp = (ev,val) => {
    ev.stopPropagation()
    setShowAllEp(val)
  }
  const setInfoInx = (ev,cur,epInx,maxInx) => {
    ev.stopPropagation()
    setCurSer(cur)
    const doEnable = epInx!==showInfo
    setShowInfo(doEnable ? epInx : undefined)
    const moduloVal = epInx % colSize
    const divVal = Math.trunc(epInx / colSize)
    let tmpLastInRow = ((divVal +1) * colSize) -1
    // Fix when last item is first in row
    if (tmpLastInRow>=maxInx) tmpLastInRow = maxInx -1
    setLastInRow(doEnable ? tmpLastInRow : undefined)
    setShowAllEp(false)
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
      startPlay(0,item,tmpEp)
    }
  }
  const InfoTileItem = ({item,img,inx}) => (
    <div>
      <div className={classes.infoTileContent}>
        <Fab
          color="primary"
          className={classes.floatingButtonClose}
          onClick={(ev) => handleCloseDetails(ev)}
        ><CloseIcon /></Fab>
        <div className={classes.infoTileLeft}>
          <Typography className={classes.areaHeadline} type="headline">{item.title}</Typography>
          <Typography className={classes.headline} type="headline">{item.description}</Typography>
          <Fab
            color="primary"
            className={classes.buttonPlay}
            onClick={(ev) => handlePlay(ev,item)}
          ><AvPlay /></Fab>
          {(item && item.download) && (<Fab
            onClick={(e) => handleDownload(e)}
            color="primary"
            aria-label="Download"
            className={classes.actionButton}
          >
            <Download/>
          </Fab>)}
          {(item && item.fileList && item.fileList.length>1) && (<IconButton
            className={classes.actionButton}
            onClick={(ev) => handleShowAllEp(ev,!showAllEp)}>
              {showAllEp ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
          </IconButton>)}
          <div className={classes.filler}/>
        </div>
      </div>
      <img
        className={classes.infoImage}
        src={img}
        alt={item.title}
      />
    </div>
  )
  const embellishInfo = (arr) => {
    const newEp = {...arr[showInfo], id: lastInRow+"b"}
//    return (showInfo!=null) ? arrayInsert(arr,showInfo+1,newEp) : arr

//onEdit={handleEditEpClick}
//onClickPlay={handleClickItemIndex}

    return (showInfo!=null) ? arrayInsert(arr,lastInRow+1,newEp) : arr
  }
  return (
    <div
      className={classes.root}
      id="home-div"
      data-active={hasCurView}
      data-disabled={(curEditModeInx!=null)}
    >
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
        {curTitleList && embellishInfo(curTitleList.slice(0,maxEntries)).map((item,inx) => {
          const serImgSrcStr = getImgOfObj(item)
          let imgSrcStr = serImgSrcStr
          let curIsSerie = (serieCurEp!=null)
          if ((curIsSerie) && (item!=null) && (item.fileList!=null)) {
            curIsSerie = (item.fileList.length>1)
          }
//          const useImg = ser.image ? getImgOfObj(ser) : ""
          const useImg = imgSrcStr
          const showTile = (inx===(showInfo))
          const infoTile = (inx===(lastInRow+1))
          const tileRootClass = (item===tmpPlaySer) ? classes.tileRootRed : classes.tileRoot
          const tileRootClassSmall = (item===tmpPlaySer) ?
                                    classes.tileRootRedSmall : classes.tileRootSmall
          const epList = curSer && curSer.fileList
          const disabled = false
          return (
              <GridListTile
                key={item.id ? item.id : item.curPath + item.title}
                cols={infoTile ? colSize : 1}
                rows={infoTile && showAllEp && epList ? 2.5 : infoTile ? 1.3 : 1}
                className={showTile ? classes.showTileRoot : infoTile ? classes.infoTileRoot : (width>=480) ? tileRootClass : tileRootClassSmall}
                onClick={(ev) => setInfoInx(ev,item,inx,maxEntries)}
              >
                {!infoTile && (
                  <div
                    onClick={(ev) => setInfoInx(ev,item,inx,maxEntries)}
                    style={(disabled) ? {cursor: "default"} : null}
                  >
                    <img
                      className={classes.image}
                      src={useImg}
                      alt={item.title}
                    />
                    <div className={classes.filler}/>
                  </div>
                )}
                {infoTile ? <InfoTileItem item={item} img={useImg} inx={inx}/>
                : <ItemBar item={item} onClick={(ev) => handleClickItemIndex(ev,item,inx)}/>}
                {infoTile && showAllEp && epList
                && (<EpList
                  title={curSer.title}
                  epList={epList}
                  navButton
                  onClick={(ev,ser,ep) => console.log(ep)}
                  serie={curSer}
                  isPaused={false}
                  useHeight={height}
                  width={width}
                  allowEdit={true}
                  imgSrc={getImgOfObj(curSer)}/>)}
              </GridListTile>
          )
        })}
      </GridList>
      {showNavButton && (<Fab
        className={classes.floatingButton}
        onClick={(ev) => toggleExpand(ev)}>{expandIcon}</Fab>)}
    </CardContent>
  </div>
  )
}

export default ItemList
