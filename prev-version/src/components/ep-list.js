import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { getImgOfObj } from '../utils/obj-functions';
import EpItemBar from './ep-item-bar.js';

const styles = theme => ({
  cardContent: {
    overflow: 'hidden',
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
  tileRoot: {
    height: 'auto !important',
  },
  tileRootRed: {
    backgroundColor: 'red',
    height: 'auto !important',
  },
})

const EpList = (props) => {
  const { classes, serie, curPlay, curEp, curPos, isPaused,
          onSetPaused, onClickPlay, imgSrc } = props;
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
  return (
    <CardContent className={classes.cardContent} >
      <GridList className={classes.gridList} cols={2.5}>
        {epList.map((ep,inx) => {
          let useImg = imgSrc;
          if (ep.image!=null) {
            useImg = getImgOfObj(ep)
          }
          return (
            <GridListTile
              key={inx}
              className={(ep===tmpPlayEp) ? classes.tileRootRed : classes.tileRoot}
            >
              <img src={process.env.PUBLIC_URL + "/" + useImg} alt={ep.title} className={classes.image}  />
              <EpItemBar
                isActive={(ep===tmpPlayEp)}
                partOfCurList={(inx<=curEpInx)}
                serie={serie}
                episode={ep}
                curPlay={curPlay}
                curPos={curPos}
                isPaused={isPaused}
                onSetPaused={onSetPaused}
                onClickPlay={onClickPlay}
              />
            </GridListTile>
          )}
        )}
      </GridList>
    </CardContent>
  )
};

EpList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EpList);
