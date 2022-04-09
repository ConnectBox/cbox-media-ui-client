import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import { Download } from 'mdi-material-ui'
import LeftIcon from '@material-ui/icons/KeyboardBackspace'
import IconButton from '@material-ui/core/IconButton'
import ItemImage from './item-image'
import { menuList } from './cbox-menu-list'

const useStyles = makeStyles(theme => ({
  areaHeadline: {
    paddingTop: 20,
    paddingLeft: 10,
    fontWeight: 600,
    width: '100%',
  },
  headline: {
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: 300,
    fontSize: '70%',
  },
  epTitle: {
    paddingTop: 15,
    paddingLeft: 10,
    fontWeight: 300,
    width: '100%',
  },
  epDescr: {
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: 100,
    fontSize: '70%',
    width: '100%',
  },
  iconButton: {
  },
  actionButton: {
    color: 'white',
    backgroundColor: 'darkgrey',
  },
  buttonPlay: {
    margin: 20,
    zIndex: 100,
  },
  floatingButtonBack: {
    margin: 0,
    top: 50,
    bottom: 'auto',
    left: 20,
    left: 'auto',
    zIndex: 100,
    position: 'fixed',
    color: '#3f51b5',
    backgroundColor: 'lightgrey',
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
  },
}))


const InfoTileItem = ({item,curEp,expandIcon,onClickClose,
                        onClickDownload,onClickPlay,onClickExpand}) => {
  const classes = useStyles()
  return (
    <div>
      <ItemImage
        item={item}
        curEp={curEp}
        onClick={(e) => onClickPlay(e)}
        height={230}
        marginTop={25}
      />
      <div className={classes.infoTileContent}>
        <Fab
          className={classes.floatingButtonBack}
          onClick={(e) => onClickClose(e)}
        ><LeftIcon /></Fab>
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
    </div>
  )
}

export default InfoTileItem
