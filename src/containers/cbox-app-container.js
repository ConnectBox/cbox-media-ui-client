import React from 'react';
import { apiGetConfig, getIdFromItem,
          apiGetStoreItem, apiSetStorage,
          apiObjGetStorage, apiObjSetStorage } from "../utils/api";
import CboxApp from '../components/cbox-app'
import localforage from 'localforage';


export default class CboxAppContainer extends React.Component {
  state = {
    langList: ["eng"], // default language
    titleList: [],
    myLang: [],
    myTitles: [],
    curPlay: undefined,
    curPos: 0,
    curDur: 0,
    cur: undefined,
    curView: undefined,
    loading: true,
  }

  componentDidMount() {
    localforage.ready().then(() => {
      console.log(localforage.driver());
      apiGetStoreItem("my-lang").then((myLang) => {
        apiGetStoreItem("my-titles").then((myTitles) => {
          apiGetConfig("cbox-lang").then((langList) => {
            apiGetConfig("cbox-titles").then((titleList) => {
              this.setState({
                titleList,
                langList,
                myTitles,
                myLang,
                loading: false
              });
            });
          });
        })
      })
    })
  }

  handleReset = () => {
console.log("reset")
    apiGetConfig("my-lang").then((myLang) => {
      apiGetConfig("my-titles").then((myTitles) => {
        this.setState({
          myTitles,
          myLang,
        });
        apiSetStorage("my-lang",myLang);
        apiSetStorage("my-titles",myTitles);
      })
    })
  }

  handleMyLangUpdate = (myLangArr) => {
    const myLang = myLangArr.split(',');
    this.setState({myLang});
    apiSetStorage("my-lang",myLang);
  }

  handleMyTitlesUpdate = (item,action) => {
    const {myTitles,myLang} = this.state;
    if (item!=null){
      if ((item.language!=null)
          && (myTitles!=null)
          && (myLang!=null)
          && (myLang.indexOf(item.language)>=0)){
        const checkID = getIdFromItem(item);
        let copyTitles = myTitles;
        if (action==="delete"){
          copyTitles[item.language] = copyTitles[item.language].filter(e => e !== checkID);
          this.setState({myTitles: copyTitles});
          apiSetStorage("my-titles",copyTitles);
        } else if (action==="add"){
          if (copyTitles[item.language]==null){
            copyTitles[item.language]=[];
          }
          copyTitles[item.language].push(checkID);
          this.setState({myTitles: copyTitles});
          apiSetStorage("my-titles",copyTitles);
        }
      }
    }
  }

  handleSongPlaying = (cur) => {
      const curPos = Math.floor(cur.position / 1000);
      const curDur = Math.floor(cur.duration / 1000);
      if ((this.state.curPos !== curPos) || (this.props.curDur !== curDur)) {
        this.setState({curPos, curDur, cur});
      }
  }

  handlePlayNext = () => {
console.log("playNext")
    const {curPlay} = this.state;
    const {curSerie, curEp} = curPlay;
    if ((curSerie.fileList!=null) && (curSerie.fileList.length>0)
        && (curEp!=null)){
      // This serie has episodes
      let epInx = curEp.id;
      epInx+=1;
      let newPlayObj = {curSerie};
      apiObjSetStorage(newPlayObj,"curEp",epInx);
      if (curSerie.fileList[epInx]!=null){
        newPlayObj.curEp=curSerie.fileList[epInx];
      }
      this.setState({curPlay: newPlayObj, cur: undefined})
    }
  }

  handleStartPlay = (inx,curSerie,curEp) => {
    if (curSerie==null){ // stop playing
      this.setState({curPlay: undefined})
    } else {
      let newPlayObj = {curSerie,curEp};
      if ((curSerie.fileList==null) || (curSerie.fileList.length<=0)){
        // No episodes
        this.setState({curPlay: newPlayObj})
      } else {
        // This serie has episodes
        if (curEp!=null){
          this.setState({curPlay: newPlayObj})
          apiObjSetStorage({curSerie},"curEp",curEp.id);
        } else {
          apiObjGetStorage(newPlayObj,"curEp").then((value) => {
            if (value==null){
              value=0;
              apiObjSetStorage(newPlayObj,"curEp",0);
            }
            if (curSerie.fileList[value]!=null){
              newPlayObj.curEp=curSerie.fileList[value];
            }
            this.setState({curPlay: newPlayObj})
          }).catch(function(err) {
            console.error(err);
          });
        }
      }
    }
  }

  handleSelectView = (curView) => {
    this.setState({curView});
  }

  render() {
    return (
      <CboxApp
        loading={this.state.loading}
        titles={this.state.titleList}
        languages={this.state.langList}
        myTitles={this.state.myTitles}
        myLang={this.state.myLang}
        curView={this.state.curView}
        curPlay={this.state.curPlay}
        curPos={this.state.cur}
        onMyLangUpdate={this.handleMyLangUpdate}
        onMyTitlesUpdate={this.handleMyTitlesUpdate}
        onReset={this.handleReset}
        onPlaying={this.handleSongPlaying}
        onPlayNext={this.handlePlayNext}
        onStartPlay={this.handleStartPlay}
        onSelectView={this.handleSelectView}
      />
    )}
}
