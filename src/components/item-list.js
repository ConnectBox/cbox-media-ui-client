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
    backgroundColor: 'whitesmoke',
    paddingTop: 70,
  },
  cardContent: {
    backgroundColor: 'whitesmoke',
    overflow: 'hidden',
    padding: 0,
    paddingLeft: 8,
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
    padding: '5px !important',
//    background:
//      'linear-gradient(to bottom, rgba(16,26,56,0.9) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  tileRootSmall: {
    padding: '5px !important',
  },
  tileRootYellow: {
    height: 'auto !important',
    padding: '5px !important',
    backgroundColor: 'yellow',
  },
  tileRootYellowSmall: {
    padding: '5px !important',
    backgroundColor: 'yellow',
  },
  tileRootRed: {
    height: 'auto !important',
    padding: '5px !important',
    backgroundColor: 'red',
  },
  tileRootRedSmall: {
    padding: '5px !important',
    backgroundColor: 'red',
  },
}))

const ItemList = (props) => {
  const { fullList, title, navButton, multiRow } = props
  const [expanded,setExpanded] = useState(!navButton)
  const [showInfoInx,setShowInfoInx] = useState(undefined)
  const [showAllEp,setShowAllEp] = useState(false)
  const {size,width,height} = useBrowserData()
  const {startPlay,curPlay} = useMediaPlayer()
  const {titles,languages,myLang,featuredTitles} = useSettings()
  const classes = useStyles()
  const handleSetInx = (epInx) => {
    const doEnable = epInx!==showInfoInx
    setShowInfoInx(doEnable ? epInx : undefined)
  }
  let curTitleList = []
  if ((titles!=null) && (featuredTitles!=null)){
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
  const showInfo = (showInfoInx!=null)
  const showItem = showInfo && curTitleList[showInfoInx]
  const showEpList = showItem && showItem.fileList
  const showUseIcon = showItem && (showItem.mediaType ? menuList[showItem.mediaType].icon : <PlayArrow/>)
  return (
    <div
      className={classes.root}
      data-disabled={false}//curEditModeInx!=null
    >
    <CardContent className={(showMulti && !navButton) ? classes.cardContentMulti : classes.cardContent} >
      {(title && <Typography className={classes.areaHeadline} type="headline" component="h2">
        {title} {showNav && (<IconButton
          className={classes.iconButton}
          onClick={(ev) => toggleExpand(ev)}>{expandIcon}</IconButton>)}
      </Typography>)}
      {(showInfo && <TileItem
        item={showItem}
        inx={showInfoInx}
        expanded={showAllEp}
        infoTile={true}
        useIcon={showUseIcon}
        epList={showEpList}
        onClick={(e) => handleClickItem(e,showInfoInx)}
        onClickClose={(e) => handleCloseDetails(e)}
        onClickDownload={(e) => handleDownload(e)}
        onClickPlay={(e) => handlePlay(e,showItem)}
        onClickExpand={(e) => handleShowAllEp(e,!showAllEp)}
      />)}
      {(!showInfo && <GridList
        className={multiRow ? classes.gridListMulti : classes.gridList}
        cols={useColSize}
      >
        {curTitleList.map((item,inx) => {
          const showTile = (inx===(showInfoInx))
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
              cols={1}
              rows={1}
              onClick={(e) => handleClickItem(e,inx)}
              className={(width>=480) ? tileRootClass : tileRootClassSmall}
            >
              <TileItem
                item={item}
                inx={inx}
                expanded={showAllEp}
                infoTile={showTile}
                useIcon={useIcon}
                epList={epList}
                onClick={(e) => handleClickItem(e,inx)}
                onClickClose={(e) => handleCloseDetails(e)}
                onClickDownload={(e) => handleDownload(e)}
                onClickPlay={(e) => handlePlay(e,item)}
                onClickExpand={(e) => handleShowAllEp(e,!showAllEp)}
              />
            </GridListTile>
          )}
        )}
      </GridList>)}
      {showNavButton && (<Fab
        className={classes.floatingButton}
        onClick={(ev) => toggleExpand(ev)}>{expandIcon}</Fab>)}
    </CardContent>
  </div>
  )
}

export default ItemList
