import React from 'react';
import MediaStoreItem from './media-store-item.js';
import EpList from './ep-list.js';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import CheckIcon from 'material-ui-icons/CheckCircle';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import Modal from 'material-ui/Modal';
import { getImgOfSerie, isEmptyObj } from '../utils/obj-functions';
import {getIdFromItem} from '../utils/api';
import {iso639Langs} from '../iso639-1-full.js'

const styles = theme => ({
  cardWrap: {
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    display: 'flex',
    height: 380,
    flexWrap: 'wrap',
  },
  card: {
    marginTop: '3%',
    marginLeft: '10%',
    position: 'relative',
    maxWidth: 685,
    color: 'whitesmoke',
    backgroundColor: '#111',
    display: 'flex',
    height: 250,
  },
  floatingButton: {
    margin: 0,
    bottom: 'auto',
    left: '5%',
    top: 0,
    right: 'auto',
    zIndex: 100,
    position: 'fixed',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
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
  moreDetailImg: {
    height: 200,
    width: 350,
  },
  root: {
    maxWidth: 768,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  gridList: {
    // Promote the list into its own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  subheader: {
    flex: 1,
    color: 'whitesmoke',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  rightIcon: {
    paddingLeft: 7,
  },
  button: {
    zIndex: 1,
    width: '100%',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  tileRoot: {
    width: "30.9333%",
    minWidth: 200,
    borderWidth: 0,
    minHeight: 100,
  },
});

const isInTitleList = (ser,list) => {
  let retVal = false;
  if ((list!=null)&&(!isEmptyObj(list))){
    const checkId = getIdFromItem(ser);
    Object.keys(list).forEach(lang => {
      if ((list[lang]!=null)
          &&(list[lang].length>0)
          &&(lang===ser.language)){
        retVal = list[lang].some(x => x === checkId)
      }
    })
  }
  return retVal;
}

const LanguageHeader = (props) => {
  const { classes, lang } = props;
  return (
    <div>
      <Subheader
        className={classes.subheader}
        component="div">
        {iso639Langs[lang].name + " (" +iso639Langs[lang].engName +")"}
      </Subheader>
    </div>
  )
}

const SerieGridBar = (props) => {
  const { classes, serie, serInx, myTitles, onMyTitlesUpdate } = props;

  const handleUncheck = (e) => {
    e.stopPropagation();
    onMyTitlesUpdate(serie,"delete")
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onMyTitlesUpdate(serie,"add")
  };

  return (
      <GridListTileBar
        title={serie.title}
        classes={{
          root: classes.titleBar,
          title: classes.title,
        }}
        subtitle={(
          <MediaStoreItem
            serie={serie}
            index={serInx}
          />
        )}
        actionIcon={
          <IconButton
            className={classes.icon}
          >
            {isInTitleList(serie,myTitles)
              ? (<CheckIcon
                    onClick={handleUncheck}
                    color="primary"
                  />)
              : (<AddIcon onClick={handleAdd}/>)}
          </IconButton>
        }
      >
      </GridListTileBar>
  )
}

class MediaStore extends React.Component {
  state = {
    open: false,
    curLang: undefined,
    showAllEp: false,
    curSer: undefined
  };

  handleShowList = () => {
    this.setState({
      showAllEp: true,
    });
  }

  handleCloseShowAllEp = () => {
    this.setState({
      showAllEp: false,
    });
  }

  handleClose = (e) => {
    this.setState({
      showAllEp: false,
      open: false
    })
  };

  handleClick = (e,index,curSer) => {
    this.setState({open: true, curSer})
  }


  render = () => {
    const { classes, titles, myTitles, myLang, filter } = this.props;
    const { showAllEp, curSer } = this.state;
    const hasTitles = ((titles!=null)&&(myLang!=null)&&(myLang.length>0));
    let curIsSerie = ((curSer!=null)
                      &&(curSer.fileList!=null)
                      &&(curSer.fileList.length>1));
    let useBkgrdColor = 'rgba(15, 4, 76, 0.68)';
    if (filter==="vid"){
      useBkgrdColor = 'rgba(255, 215, 0, 0.78)';
    }
    const subheaderRootStyle = {
      paddingTop: 35,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      height: 'auto',
    };
    return (
      <div className={classes.root}>
        {hasTitles && myLang.map((lang,inx) => {
          let filteredSerList = [];
          if ((titles[lang]!=null)&&(!isEmptyObj(titles[lang]))){
            Object.keys(titles[lang]).forEach((title) => {
              if (((titles[lang][title]!=null)
                    &&(titles[lang][title].mediaType===filter))
                  || (filter==='')){
                filteredSerList.push(titles[lang][title])
              }
            })
          }
          if (filteredSerList.length>0){
            return (
              <GridList
                key={inx}
                cellHeight={200}
                cols={3}
                spacing={3}
                className={classes.gridList}
              >
                <GridListTile
                  style={subheaderRootStyle}
                  cols={3}
                >
                  <LanguageHeader
                    onClick={this.handleCreateNew}
                    filter={filter}
                    lang={lang}
                    classes={classes}
                  />
                </GridListTile>
                {filteredSerList.map((ser,serInx) => {
                  const imgSrcStr = getImgOfSerie(ser);
                  return (
                    <GridListTile
                      key={serInx}
                      onClick={(e)=>{this.handleClick(e,serInx,ser)}}
                      className={classes.tileRoot}
                    >
                      <img src={imgSrcStr} alt={ser.title} />
                      <SerieGridBar
                        classes={classes}
                        serie={ser}
                        serInx={serInx}
                        myTitles={myTitles}
                        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
                        onClick={this.props.onClick}/>
                    </GridListTile>
                  )})}
                </GridList>
              )} else {
                return <div key={inx}></div>
              }
          }
        )}
        <Modal
          open={this.state.open}
          style={{backgroundColor: useBkgrdColor}}
          onBackdropClick={this.handleClose}
          onClose={this.handleClose}
        >
          <Card
            className={showAllEp ? classes.cardWrap : classes.card}>
             {(curSer!=null)
             && (<div className={classes.details}>
               <CardContent className={classes.content}>
                 <Typography className={classes.headline} type="headline" component="h2">
                   {curSer.title}
                 </Typography>
                 <Typography className={classes.description} type="subheading">
                   {curSer.description}
                 </Typography>
                 <Typography className={classes.epTitle} type="subheading">
                   <MediaStoreItem
                     serie={curSer}
                     onlyEpTitle={true}
                   />
                 </Typography>
               </CardContent>
               <CardActions>
                 {curIsSerie && showAllEp && (<IconButton
                   className={classes.actionButton}
                   onClick={this.handleCloseShowAllEp}><ExpandLessIcon nativeColor="grey"/></IconButton>)}
                 {curIsSerie && !showAllEp && (<IconButton
                   className={classes.actionButton}
                   onClick={this.handleShowList}><ExpandMoreIcon nativeColor="grey"/></IconButton>)}
                 <Button
                   variant="fab"
                   onClick={this.handleClose}
                   className={classes.floatingButton}
                   color="primary"
                 >
                   <CloseIcon />
                 </Button>
               </CardActions>
             </div>)}
             {(curSer!=null)&&(!showAllEp)
             && (<CardMedia
                 className={classes.moreDetailImg}
                 image={process.env.PUBLIC_URL + "/" + getImgOfSerie(curSer)}
                 title={curSer.title}
               />)}
             {curIsSerie && showAllEp
             && (<EpList
               serie={curSer}
               isPaused={false}
               imgSrc={getImgOfSerie(curSer)}/>)}
           </Card>
        </Modal>
      </div>
    )
  }
}

MediaStore.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MediaStore);
