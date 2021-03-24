import React, {useState} from 'react'
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
import TileItem from './tile-item'
import { menuList } from './cbox-menu-list'
import {arrayInsert} from '../utils/obj-functions'
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
  tileRootYellow: {
    height: 'auto !important',
    backgroundColor: 'yellow',
  },
  tileRootYellowSmall: {
    backgroundColor: 'yellow',
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
  const { fullList, title, navButton, multiRow } = props
  const [expanded,setExpanded] = useState(!navButton)
  const [lastInRow,setLastInRow] = useState(undefined)
  const [showInfo,setShowInfo] = useState(undefined)
  const [showAllEp,setShowAllEp] = useState(false)
  const {size,width,height} = useBrowserData()
  const {startPlay,curPlay} = useMediaPlayer()
  const {titles,languages,myLang,featuredTitles} = useSettings()
  const classes = useStyles()
  const handleSetInx = (epInx) => {
    const doEnable = epInx!==showInfo
    setShowInfo(doEnable ? epInx : undefined)
    const divVal = Math.trunc(epInx / colSize)
    let tmpLastInRow = ((divVal +1) * colSize) -1
    // Fix when last item is first in row
    if (tmpLastInRow>=maxEntries) tmpLastInRow = maxEntries -1
    setLastInRow(doEnable ? tmpLastInRow : undefined)
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
  const sizeToCol = {"xl": 5, "lg": 4, "md": 3}
  let colSize = sizeToCol[size] || 2
  let curHeight = height-150
  if (width<=380){
    colSize = 1
    if (curHeight>300){
      curHeight = 300
    }
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
  const embellishInfo = (arr) => {
    const newEp = {...arr[showInfo], id: lastInRow+"b"}
    return (showInfo!=null) ? arrayInsert(arr,lastInRow+1,newEp) : arr
  }
  const handleClickItem = (ev,inx) => {
    ev.stopPropagation()
console.log(inx)
//    setShowAllEp(false)
    handleSetInx(inx)
  }
/*
  const handleClickItem = (ev,item) => {
    ev.stopPropagation()
    if (startPlay!=null) {
      startPlay(undefined,item,undefined)
    }
  }
  */
  const handleCloseDetails = (ev) => {
    ev.stopPropagation()
    setShowAllEp(false)
    handleSetInx(undefined)
  }
  const handlePlay = (ev,item) => {
    ev.stopPropagation()
    startPlay(undefined,item)
  }
  const handleDownload = (ev,item) => {
    ev.stopPropagation()
    console.log(item)
  }
  const handleShowAllEp = (ev,val) => {
    ev.stopPropagation()
    setShowAllEp(val)
  }

  let tmpPlaySer = curPlay && curPlay.curSerie
  return (
    <div
      className={classes.root}
      data-disabled={false}//curEditModeInx!=null
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
          const showTile = (inx===(showInfo))
          const infoTile = (inx===(lastInRow+1))
          const tileRootClass = showTile ? classes.tileRootYellow
                                  : (item===tmpPlaySer) ? classes.tileRootRed
                                      : classes.tileRoot
          const tileRootClassSmall = showTile ? classes.tileRootYellowSmall
                                      : (item===tmpPlaySer) ? classes.tileRootRedSmall
                                          : classes.tileRootSmall
          const epList = item && item.fileList
          const useIcon = (item.mediaType ? menuList[item.mediaType].icon : <PlayArrow/>)
//          const useIcon = (item.mediaType ? menuList[item.mediaType].icon : ((isPaused) || (!isActive)) ? (useIcon || <PlayArrow/>) : <Pause/>)
          return (
            <GridListTile
              key={item.id ? item.id : item.curPath + item.title}
              cols={infoTile ? colSize : 1}
              rows={infoTile && showAllEp && epList ? 2.5 : infoTile ? 1.3 : 1}
              onClick={(e) => (infoTile) ? handleCloseDetails(e) : handleClickItem(e,inx)}
              className={infoTile ? classes.infoTileRoot : (width>=480) ? tileRootClass : tileRootClassSmall}
            >
              <TileItem
                item={item}
                inx={inx}
                expanded={showAllEp}
                infoTile={infoTile}
                useIcon={useIcon}
                epList={epList}
                onClick={(e) => (infoTile) ? handleCloseDetails(e) : handleClickItem(e,inx)}
                onClickClose={(e) => handleCloseDetails(e)}
                onClickDownload={(e) => handleDownload(e)}
                onClickPlay={(e) => handlePlay(e,item)}
                onClickExpand={(e) => handleShowAllEp(e,!showAllEp)}
              />
            </GridListTile>
          )}
        )}
      </GridList>
      {showNavButton && (<Fab
        className={classes.floatingButton}
        onClick={(ev) => toggleExpand(ev)}>{expandIcon}</Fab>)}
    </CardContent>
  </div>
  )
}

export default ItemList
