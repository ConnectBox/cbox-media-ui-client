import React from 'react';
import PropTypes from 'prop-types';
import Tappable from 'react-tappable';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import NavChevronLeft from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import AvPlay from '@material-ui/icons/PlayArrow';
import AvPause from '@material-ui/icons/Pause';
import ContentAddCircleOutline from '@material-ui/icons/AddCircleOutline';
import {getImgOfObj} from '../utils/obj-functions';
import { unique } from 'shorthash';
import { Download } from 'mdi-material-ui';
import EpList from './ep-list.js';
import { apiObjGetStorage } from '../utils/api';

const styles = theme => ({
  cardWrap: {
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  subheading: {
    color: 'grey',
  },
  description: {
    fontSize: '0.9rem',
    color: 'grey',
  },
  epTitle: {
    paddingTop: 15,
    color: 'lightgrey',
  },
  headline: {
    paddingTop: 15,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  playPause: {
    backgroundColor: 'rgba(44,135,213,0.3)',
  },
  actionButton: {
    width: 100,
  },
  image: {
    height: 200,
    width: 350,
  },
  closeButtonLScreen: {
    right: -10,
    top: -10,
    zIndex: 100,
    position: 'absolute',
  },
  closeButton: {
    right: -10,
    zIndex: 100,
    position: 'fixed',
  },
  bookmarkButtonLScreen: {
    left: '75%',
    top: 117,
//    color: 'white',
//    backgroundColor: 'red',
    zIndex: 100,
    position: 'absolute',
  },
  bookmarkButton: {
    left: 132,
    marginTop: 5,
//    color: 'white',
//    backgroundColor: 'red',
    zIndex: 100,
    position: 'fixed',
  },
  floatingButton: {
    margin: 0,
    color: 'white',
    backgroundColor: '#333',
    bottom: 'auto',
    left: '12%',
    top: 20,
    right: 'auto',
    zIndex: 100,
    position: 'relative',
  },
})

const PlayButton = (props) => {
  const { classes, onClick } = props;
  return (
    <IconButton
      className={classes.playPause}
    >
      <AvPlay
        nativeColor="grey"
        onClick={onClick}/>
    </IconButton>
  )
}

const PauseButton = (props) => {
  const { classes, onClick } = props;
  return (
    <IconButton
      className={classes.playPause}
    >
      <AvPause
        nativeColor="grey"
        onClick={onClick}/>
    </IconButton>
  )
}

class SeriesItem extends React.Component {
  state = {
    message: '',
    open: false,
    showAllEp: false,
    longPressMode: false,
    serieCurEp: undefined,
    playerWidth: this.calcContainerWidth(),
    playerHeight: this.calcContainerHeight(),
  }

  calcContainerWidth() {
    let retVal = document.body.clientWidth;
    return retVal;
  }

  calcContainerHeight() {
    let retVal = document.body.clientHeight;
    return retVal;
  }

  restoreCurEp = (obj) => {
    let tmpEp = undefined;
    const tmpObj = {curSerie: obj};
    apiObjGetStorage(tmpObj,"curEp").then((value) => {
      if (value==null){
        value=0;
      }
      if ((obj!=null) && (obj.fileList!=null)
          && (obj.fileList[value]!=null)){
        tmpEp=obj.fileList[value];
      }
      this.setState({serieCurEp: tmpEp})
    }).catch(function(err) {
      console.error(err);
    });
  }

  componentDidMount = () => {
    const {serie,curPlay} = this.props;
    window.addEventListener('resize', () => {
      const playerWidth = this.calcContainerWidth();
      const playerHeight = this.calcContainerHeight();
      this.setState({playerWidth,playerHeight});
    }, false);
    if (serie!=null){
      if ((curPlay!=null) && (curPlay.curSerie===serie) && (curPlay.curEp!=null)){
        this.setState({serieCurEp: curPlay.curEp})
      } else {
        this.restoreCurEp(serie);
      }
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {serie,curPlay} = nextProps;
    if (serie!=null){
      if (serie!==this.props.serie){
        if ((curPlay!=null) && (curPlay.curSerie===serie) && (curPlay.curEp!=null)){
          this.setState({serieCurEp: curPlay.curEp})
        } else {
          this.restoreCurEp(serie);
        }
      } else if ((curPlay!=null) && (this.props.curPlay!=null)
                  && (curPlay.curEp!==this.props.curPlay.curEp)){
        if ((curPlay.curSerie===serie)
            && ((this.state.curEp==null)
                || (curPlay.curEp.id>this.state.curEp.id))){
          this.setState({serieCurEp: curPlay.curEp})
        }
      }
    }
  }

  handleCloseDialog = () => {
    this.setState({
      showAllEp: false,
    });
    if (this.props.onSelectView!=null) {
        this.props.onSelectView(undefined);
    }
  }

  handleCloseLongPressMode = () => {
    this.setState({
      longPressMode: false,
    });
    if (this.props.onSetEditMode!=null){
      this.props.onSetEditMode(false)
    }
  }

  handleCloseShowAllEp = () => {
    this.setState({
      showAllEp: false,
    });
  }

  handleDeleteSerie = () => {
    this.setState({
      longPressMode: false,
    });
    if (this.props.onMyTitlesUpdate!=null){
      this.props.onMyTitlesUpdate("delete")
    }
    if (this.props.onSetEditMode!=null){
      this.props.onSetEditMode(false)
    }
  }

  handleAddSerie = () => {
    this.setState({
      longPressMode: false,
    });
    if (this.props.onMyTitlesUpdate!=null){
      this.props.onMyTitlesUpdate("add")
    }
    if (this.props.onSetEditMode!=null){
      this.props.onSetEditMode(false)
    }
  }

  handleDownload = (ev) => {
    this.setState({
      message: 'Sorry! -> Download is not yet implemented...',
      open: true,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      showAllEp: false,
    });
  }

  handleShowList = () => {
    this.setState({
      showAllEp: true,
    });
  }

  handleSetPaused = (ev) => {
    ev.stopPropagation();
    if (this.props.onSetPaused!=null) {
      this.props.onSetPaused(!this.props.isPaused);
    }
  }

  handleClickItemIndex = (index) => {
    const {serie} = this.props;
    var tmpEp = undefined;
    if ((serie!=null) && (serie.fileList!=null)
        && (serie.fileList[index]!=null)){
      tmpEp=serie.fileList[index];
    }
    if (this.props.onStartPlay!=null) {
      this.setState({serieCurEp: tmpEp})
      this.props.onStartPlay(serie,tmpEp);
    }
  }

  handleClickItem = (ev) => {
    ev.stopPropagation();
    if (!this.state.longPressMode){
      const {serie,curPlay} = this.props;
      if ((curPlay==null) && (this.props.onStartPlay!=null)) {
        this.props.onStartPlay(serie);
      }
      if (this.props.onSelectView!=null) {
        this.props.onSelectView(serie);
      }
    }
  }

	handlePressed = (e) => {
    this.setState({longPressMode: true})
		console.log('Pressed');
    if (this.props.onSetEditMode!=null){
      this.props.onSetEditMode(true)
    }
	}

  render() {
    const { classes, serie, curView, curPlay, inMyList,
            navigationMode, isPreview, largeScreen } = this.props;
    const { playerHeight, playerWidth, showAllEp, serieCurEp, longPressMode } = this.state;
    const serImgSrcStr = getImgOfObj(serie);
    let imgSrcStr = serImgSrcStr;
    let curIsSerie = (serieCurEp!=null);
    if ((curIsSerie) && (serie!=null) && (serie.fileList!=null)) {
      curIsSerie = (serie.fileList.length>1);
    }
    let tmpTitle = serie.title
    let curEpDescr="";
    if (serieCurEp!=null){
      if (serieCurEp.image!=null) {
        imgSrcStr = getImgOfObj(serieCurEp);
      }
      if (serieCurEp.title!=null){
        curEpDescr = serieCurEp.title
      } else if (!curIsSerie) {
        curEpDescr = "";
      } else {
        curEpDescr = serieCurEp.id +1;
      }
    }
    let serSubTitle = curEpDescr;
    if (!curIsSerie) {
      serSubTitle = serie.description;
    }
    if (imgSrcStr == null) {
      return (
        <div></div>
    )} else {
      const isCurPlaying = ((serie != null)
                            && (curPlay!=null)
                            && (curPlay.curSerie!=null)
                            && (serie === curPlay.curSerie));
      let playStateIcon = <PauseButton classes={classes} onClick={this.handleSetPaused}/>;
      const isVideoPlaying = (isCurPlaying && (curPlay.curSerie.mediaType === "vid"));
      const isBookActive = (isCurPlaying && (curPlay.curSerie.mediaType === "epub"));
      const isTrainingActive = (isCurPlaying && (curPlay.curSerie.mediaType === "html"));
      let hideNavigation = isBookActive || isTrainingActive;
      if (!isCurPlaying) {
        playStateIcon = <PlayButton classes={classes}onClick={(e) => this.handleClickItem(e)}/>;
      } else if (this.props.isPaused) {
        playStateIcon = <PlayButton classes={classes} onClick={this.handleSetPaused}/>;
      } else if (isVideoPlaying) {
        const tempHeight = (Math.trunc((playerWidth)*9/16));
        hideNavigation = playerHeight -tempHeight < 150; // hide if less than margin
      }
      let bookmarkIcon = <ContentAddCircleOutline nativeColor="grey" onClick={this.handleBookmark}/>;
/*
      if (bookmarkList.indexOf(serie._id)>=0) {
        bookmarkIcon = <ActionCheckCircle color="grey" onClick={this.handleBookmark}/>;
      }
*/
//      <PausePreviewIcon style={iconStyles} color={red500} hoverColor={greenA200} />
      const isActiveSerie = ((curView!= null) && (curView === serie));
      if (hideNavigation) {
        return <div/>
      } else if (isActiveSerie) {
        return (
          <div
             style={styles.card}
             data-active={isActiveSerie}
             data-playing={isCurPlaying}
          >
             {navigationMode && (<Fab
               size="small"
               className={classes.floatingButton}
               onClick={this.handleCloseDialog} >
                 <NavChevronLeft />
             </Fab>)}
             <Card className={showAllEp ? classes.cardWrap : classes.card}>
               <div className={classes.details}>
                 <CardContent className={classes.content}>
                   <Typography className={classes.headline} type="headline" component="h2">
                     {tmpTitle}
                   </Typography>
                   <Typography className={classes.description} type="subheading">
                     {serie.description}
                   </Typography>
                   <Typography className={classes.epTitle} type="subheading">
                     {curEpDescr}
                   </Typography>
                 </CardContent>
                 <CardActions>
                   {isPreview && (<IconButton
                     className={classes.actionButton}
                     onClick={this.handleBookmark}>{bookmarkIcon}</IconButton>)}
                   {!isPreview && curIsSerie && showAllEp && (<IconButton
                     className={classes.actionButton}
                     onClick={this.handleCloseShowAllEp}><ExpandLessIcon nativeColor="lightgrey"/></IconButton>)}
                   {!isPreview && curIsSerie && !showAllEp && (<IconButton
                     className={classes.actionButton}
                     onClick={this.handleShowList}><ExpandMoreIcon nativeColor="lightgrey"/></IconButton>)}
                   {isPreview && (<IconButton
                     className={classes.actionButton}
                     onClick={this.handleDownload}><Download nativeColor="grey"/></IconButton>)}
                   <IconButton
                     className={classes.actionButton}
                    >{playStateIcon}</IconButton>
                 </CardActions>
               </div>
               {!showAllEp && (<CardMedia
                 className={classes.image}
                 image={process.env.PUBLIC_URL + "/" + imgSrcStr}
                 title={serie.title}
               />)}
               {showAllEp && (<EpList
                 serie={serie}
                 curEp={this.state.serieCurEp}
                 curPlay={curPlay}
                 curPos={this.props.curPos}
                 isPaused={this.props.isPaused}
                 imgSrc={serImgSrcStr}
                 onClickPlay={this.handleClickItemIndex}
                 onSetPaused={this.handleSetPaused}
               />)}
             </Card>
            <Snackbar
              open={this.state.open}
              message={this.state.message}
              autoHideDuration={3500}
            />
          </div>
        )
      } else {
        return (
          <Tappable
            onPress={this.handlePressed}
            onClick={(e) => this.handleClickItem(e)}
            className="serie-div shadow"
            style={(this.props.disabled) ? {cursor: "default"} : null}
            data-active={isActiveSerie}
            data-playing={isCurPlaying}
            data-edit-mode={longPressMode}
            data-disabled={this.props.disabled}
          >
            {longPressMode && !inMyList &&
              (<Fab
                size="small"
                color="primary"
                className={largeScreen ? classes.bookmarkButtonLScreen : classes.bookmarkButton}
                onClick={this.handleAddSerie}
              >
                {bookmarkIcon}
              </Fab>
            )}
            {longPressMode && inMyList &&
              (<Fab
                size="small"
                color="primary"
                className={largeScreen ? classes.bookmarkButtonLScreen : classes.bookmarkButton}
                onClick={this.handleDeleteSerie}
              >
                <DeleteIcon />
              </Fab>
            )}
            {longPressMode &&
              (<Fab
                size="small"
                onClick={this.handleCloseLongPressMode}
                className={largeScreen ? classes.closeButtonLScreen : classes.closeButton}
              >
                <CloseIcon />
              </Fab>
            )}
            <div
              className={unique(serie.title)+'_item item-div'}
            >
              <img className="image" src={process.env.PUBLIC_URL + "/" + imgSrcStr} alt="" />
              <div className="Title">{serie.title}
                {isPreview && (<div className="Description">{serie.description}</div>)}
                <div className="EpDescription">{serSubTitle}</div>
              </div>
            </div>
          </Tappable>
      )}
    }
  }
};

SeriesItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SeriesItem);
