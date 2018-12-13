import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SeriesItem from './series-item.js';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { withNamespaces } from 'react-i18next';

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

  renderListItem = (ser,index,inMyList) => {
    const { fullList, largeScreen,
            curView, curPlay, curPos,
            isPaused } = this.props;
    return (
      <SeriesItem
        serie={ser}
        key={index}
        index={index}
        navigationMode={true}
        disabled={((this.state.curEditModeInx!=null) && (this.state.curEditModeInx!==index))}
        largeScreen={largeScreen}
        isPreview={fullList}
        inMyList={inMyList}
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
  }

  render = () => {
    const { t, classes, titles,
            channel, languages,
            myTitles, featuredList, myLang,
            fullList, filter, largeScreen,
            curView } = this.props;
    let myList = [];
    let extList = [];
    if (titles!=null){
      if (fullList){
        languages.forEach(lang => {
          if (titles[lang]!=null){
            Object.keys(titles[lang]).forEach((title) => {
              myList.push(titles[lang][title])
            })
          }
        })
      } else {
        if ((titles!=null)&&(myTitles!=null)){
          Object.keys(myTitles).filter(
            lang => myLang.indexOf(lang)>=0
          ).forEach((lang) => {
            if (titles[lang]!=null){
              myTitles[lang].forEach((title) => {
                if (titles[lang][title]!=null){
                  myList.push(titles[lang][title])
                }
              })
            }
          });
        }
        if ((titles!=null)&&(featuredList!=null)){
          Object.keys(featuredList).filter(
            lang => myLang.indexOf(lang)>=0
          ).forEach((lang) => {
            if (titles[lang]!=null){
              featuredList[lang].forEach((title) => {
                if ((titles[lang][title]!=null)
                    &&(!myList.includes(titles[lang][title]))){
                  extList.push(titles[lang][title])
                }
              })
            }
          });
        }
      }
    }
    const hasCurView = (curView!= null);
    const emptyList = ((myList.length===0)&&(extList.length===0))
    if (emptyList) {
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
                variant="contained"
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
      let featuredStr = t("featured");
      if ((channel!=null) && (channel.title!=null)) {
        featuredStr = channel.title;
      }
      let showMyListTitle = (myList.length>0);
      let showExtListTitle = ((channel!=null) || ((myList.length>0) && (extList.length>0)));
      if (hasCurView) {
        showMyListTitle = false;
        showExtListTitle = false;
      }
      return (
        <div id="home-div"
          data-active={hasCurView}
          data-disabled={(this.state.curEditModeInx!=null)}
        >
          {showMyListTitle && (<div className="list-header">{t("myList")}</div>)}
          {myList.filter((ser) => {
              return ((ser.mediaType===filter) || (filter===''))
            }).map((ser,index) => {
              return this.renderListItem(ser,index,true)
          })}
          {showExtListTitle && (<div className="list-header">{featuredStr}</div>)}
          {extList.filter((ser) => {
              return ((ser.mediaType===filter) || (filter===''))
            }).map((ser,index) => {
              return this.renderListItem(ser,index,false)
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

export default withStyles(styles, { withTheme: true })(withNamespaces()(MyTitlesList));
