import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SeriesItem from './series-item.js';
import Button from 'material-ui/Button';
import RestoreIcon from 'material-ui-icons/SettingsBackupRestore';

const styles = theme => ({
  button: {
    position: 'relative',
    margin: '22px 0 0 40px',
  },
  buttonLScreen: {
    position: 'relative',
    margin: '85px 0 0 29px',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class MyTitlesList extends React.Component {
  state = {
    curEditModeInx: undefined,
  };

  handleReset = () => {
    if (this.props.onReset!=null){
      this.props.onReset()
    }
  }

  handleStartPlay = (inx) => (curSerie,curEp,curFName,bStopCurrentPlayback) => {
    if (this.props.onStartPlay!=null){
      this.props.onStartPlay(inx,curSerie,curEp,curFName,bStopCurrentPlayback)
    }
  }

  handleTitlesUpdate = (ser) => (action) => {
    if (this.props.onMyTitlesUpdate!=null){
      this.props.onMyTitlesUpdate(ser,action)
    }
  }

  handleSetEditMode = (ser) => (isSet) => {
    if (isSet){
      this.setState({curEditModeInx: ser})
    } else {
      this.setState({curEditModeInx: undefined})
    }
  }

  render = () => {
    const { classes, titles, languages,
            myTitles, myLang, fullList, filter,
            largeScreen, curView, curPlay, curPos,
            isPaused } = this.props;
    let curTitleList = [];
    if (titles!=null){
      if (fullList){
        languages.forEach(lang => {
          if (titles[lang]!=null){
            Object.keys(titles[lang]).forEach((title) => {
              curTitleList.push(titles[lang][title])
            })
          }
        })
      } else if ((titles!=null)&&(myTitles!=null)){
        Object.keys(myTitles).filter(
          lang => myLang.indexOf(lang)>=0
        ).forEach((lang) => {
          if (titles[lang]!=null){
            myTitles[lang].forEach((title) => {
              if (titles[lang][title]!=null){
                curTitleList.push(titles[lang][title])
              }
            })
          }
        });
      }
    }
    const hasCurView = (curView!= null);
    if (curTitleList.length===0){
      return (
        <div id="home-div"
          data-active={false}
          data-disabled={false}
        >
          <div
            className="serie-div"
            data-active={false}
            data-playing={false}
          >
            <div
              className="item-div"
            >
              <Button
                className={largeScreen? classes.buttonLScreen : classes.button }
                onClick={this.handleReset}
                variant="raised"
                size="small"
              >
                Restore Default
                <RestoreIcon className={classes.rightIcon}/>
              </Button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div id="home-div"
          data-active={hasCurView}
          data-disabled={(this.state.curEditModeInx!=null)}
        >
          {curTitleList.filter((ser) => {
              return ((ser.mediaType===filter) || (filter===''))
            }).map((ser,index) => {
              return (
                <SeriesItem
                  serie={ser}
                  key={index}
                  index={index}
                  disabled={((this.state.curEditModeInx!=null) && (this.state.curEditModeInx!==index))}
                  largeScreen={largeScreen}
                  isPreview={fullList}
                  isPaused={isPaused}
                  onSetPaused={this.props.onSetPaused}
                  onSelectView={this.props.onSelectView}
                  onPlayNext={this.props.onPlayNext}
                  onStartPlay={this.handleStartPlay(index)}
                  onMyTitlesUpdate={this.handleTitlesUpdate(ser)}
                  onSetEditMode={this.handleSetEditMode(index)}
                  curPlay={curPlay}
                  curPos={curPos}
                  curView={curView}/>
              )
          })}
        </div>
      )
    }
  }
}

MyTitlesList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MyTitlesList);
