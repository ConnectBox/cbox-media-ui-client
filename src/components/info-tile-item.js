import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import { Download } from 'mdi-material-ui'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import ItemImage from './item-image'
import { menuList } from './cbox-menu-list'

const useStyles = makeStyles(theme => ({
  areaHeadline: {
    paddingTop: 20,
    paddingLeft: 10,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.87)',
    width: '100%',
  },
  headline: {
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: 300,
    fontSize: '70%',
    color: 'rgba(255, 255, 255, 0.87)',
  },
  epTitle: {
    paddingTop: 15,
    paddingLeft: 10,
    fontWeight: 300,
    color: 'rgba(255, 255, 255, 0.87)',
    width: '100%',
  },
  epDescr: {
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: 100,
    fontSize: '70%',
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
  infoImage: {
    height: 230,
    float: 'right',
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
}))


const InfoTileItem = ({item,curEp,expandIcon,onClickClose,
                        onClickDownload,onClickPlay,onClickExpand}) => {
  const classes = useStyles()
  return (
    <div>
      <div className={classes.infoTileContent}>
        <Fab
          color="primary"
          className={classes.floatingButtonClose}
          onClick={(e) => onClickClose(e)}
        ><CloseIcon /></Fab>
        <div className={classes.infoTileLeft}>
          <Typography className={classes.areaHeadline} type="headline">{item.title}</Typography>
          <Typography className={classes.headline} type="headline">{item.description}</Typography>
          {curEp && <Typography className={classes.epTitle} type="headline">{curEp.title}</Typography>}
          {curEp && <Typography className={classes.epDescr} type="headline">{curEp.descr}</Typography>}
          <Fab
            color="primary"
            className={classes.buttonPlay}
            onClick={(e) => onClickPlay(e)}
          >
            {item.mediaType ? menuList[item.mediaType].icon : <PlayArrow/>}
          </Fab>
          {(item && item.download) && (<Fab
            onClick={(e) => onClickDownload(e)}
            color="primary"
            aria-label="Download"
            className={classes.actionButton}
          >
            <Download/>
          </Fab>)}
          {(item && item.fileList && item.fileList.length>1) && (<IconButton
            className={classes.actionButton}
            onClick={(e) => onClickExpand(e)}>
              {expandIcon}
          </IconButton>)}
          <div className={classes.filler}/>
        </div>
      </div>
      <ItemImage
        item={item}
        curEp={curEp}
        onClick={(e) => onClickPlay(e)}
        height={230}
        float="right"
      />
    </div>
  )
}

export default InfoTileItem
