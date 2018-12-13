import React from 'react';
import { apiGetConfig, getIdFromItem,
          apiGetStoreItem, apiSetStorage, apiGetStorage,
          apiObjGetStorage, apiObjSetStorage } from "../utils/api";
import CboxApp from '../components/cbox-app'
import localforage from 'localforage';
import locale2 from 'locale2'
import {iso639_3b2} from '../iso639-3b2'


export default class CboxAppContainer extends React.Component {
  state = {
    langList: ["eng"], // default language
    titleList: [],
    featuredList: [],
    myLang: [],
    myTitles: [],
    exclTitles: [],
    channel: undefined,
    curPlay: undefined,
    curPos: 0,
    curDur: 0,
    cur: undefined,
    curView: undefined,
    loading: true,
    defaultLang: undefined
  }

  componentDidMount() {
    const defaultLang = iso639_3b2[locale2.substr(0,2)]
    this.setState({defaultLang})
    localforage.ready().then(() => {
      console.log(localforage.driver());
      apiGetStoreItem("my-lang").then((myLang) => {
        apiGetStorage("my-titles").then((myTitles) => {
          apiGetStorage("excl-titles").then((exclTitles) => {
            apiGetConfig("cbox-lang").then((langList) => {
              apiGetConfig("cbox-titles").then((titleList) => {
                apiGetConfig("cbox-featured").then((featuredList) => {
                  if ((featuredList.length<=0)&&(myTitles==null)){
                    // Backwards compatibility - empty featuredList? - try this
                    apiGetStoreItem("my-titles").then((findTitles) => {
                      myTitles=findTitles;
                    })
                  }
                  apiGetConfig("channel").then((channel) => {
                    if (myTitles==null) {
                      myTitles=[];
                    }
                    this.setState({
                      langList,
                      titleList,
                      featuredList,
                      myTitles,
                      exclTitles,
                      myLang,
                      channel,
                      loading: false
                    });
                  });
                });
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

  handleMyLangUpdate = (myLang) => {
    this.setState({myLang});
    apiSetStorage("my-lang",myLang);
  }

  handleMyTitlesUpdate = (item,action) => {
    const {myTitles,myLang} = this.state;
    if (item!=null){
      if ((item.language!=null)
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
console.log(copyTitles)
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
      if (curSerie.fileList.length-1>epInx){
        epInx+=1;
        let newPlayObj = {curSerie};
        apiObjSetStorage(newPlayObj,"curEp",epInx);
        if (curSerie.fileList[epInx]!=null){
          newPlayObj.curEp=curSerie.fileList[epInx];
        }
        this.setState({curPlay: newPlayObj, cur: undefined})
      } else {
        this.setState({curPlay: undefined, cur: undefined})
      }
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
console.log(value)
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
    const { loading, channel, titleList, defaultLang,
            langList, myTitles, featuredList,
            exclTitles, myLang, curView, curPlay, cur } = this.state;
    return (
      <CboxApp
        loading={loading}
        channel={channel}
        titles={titleList}
        languages={langList}
        myTitles={myTitles}
        defaultLang={defaultLang}
        featuredList={featuredList}
        exclTitles={exclTitles}
        myLang={myLang}
        curView={curView}
        curPlay={curPlay}
        curPos={cur}
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
