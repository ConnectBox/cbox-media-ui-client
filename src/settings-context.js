import React, { useState, useEffect } from 'react'
import { isEmptyObj, isEmpty, pad,
          getLocalMediaFName } from './utils/obj-functions'
import { getHostPathSep, readFileAsync,
            getLocale,
              curWindowSize, curContentSize } from './utils/file-functions'
import { apiGetConfig, getIdFromItem,
          apiGetStoreItem, apiSetStorage, apiGetStorage,
          apiObjGetStorage, apiObjSetStorage } from "./utils/api"
import { loadingStateValue } from "./utils/config-data"
import { iso639_3b2 } from './iso639-3b2'
import { useTranslation } from 'react-i18next'
import path from 'path'
import {chInBook} from './naviChapters'
import { unique } from 'shorthash'
import localforage from 'localforage'
import locale2 from 'locale2'

const versionStr = '2.20'

const configDir = getHostPathSep() + "config" + getHostPathSep() + "mediaUI" + getHostPathSep()

const configPaths = {
  titleList: configDir+"cbox-titles.js",
  featuredTitles: configDir+"cbox-featured.js",
  langList: configDir+"cbox-lang.js",
  labelList: configDir+"cbox-label.js",
  myLang: configDir+"my-lang.js",
//  langText: configDir+"cbox-lang-text.js",
  channel: configDir+"channel.js",
}

const deleteProperty = (obj, id) => {
  return (({[id]: deleted, ...obj}) => obj)(obj)
}

const SettingsContext = React.createContext([{}, () => {}])
const SettingsProvider = ({children}) => {
  const [state, setState] = useState({
    curLang: "deu",
    param: "",
    locPath: "",
  })
  const { t } = useTranslation()
  const setStateKeyVal = (key,val) => setState(state => ({ ...state, [key]: val }))
  const { langList, titleList, labelList, myLang,
          featuredTitles, channel, defaultLang, cur, lang,
          label, accessToken, installMissing, includeTestFiles, isDownloading,
          downloadingText, progressText, percentProgress
        } = state

  const getAllConfig = async () => {
    const defaultLang = iso639_3b2[locale2.substr(0,2)]
console.log("0")
      setStateKeyVal("defaultLang",defaultLang)
console.log("1")
      localforage.ready().then(() => {
        console.log(localforage.driver());
console.log("2")
        apiGetStoreItem("my-lang").then((myLang) => {
console.log("3")
          apiGetStorage("my-titles").then((myTitles) => {
console.log("4")
            apiGetStorage("excl-titles").then((exclTitles) => {
console.log("5")
              apiGetConfig("cbox-lang").then((langList) => {
console.log("6")
                apiGetConfig("cbox-titles").then((titleList) => {
console.log("7")
                  apiGetConfig("cbox-featured").then((featuredTitles) => {
                    if ((featuredTitles.length<=0)&&(myTitles==null)){
                      // Backwards compatibility - empty featuredTitles? - try this
                      apiGetStoreItem("my-titles").then((findTitles) => {
                        myTitles=findTitles;
                      })
                    }
                    apiGetConfig("channel").then((channel) => {
                      if (myTitles==null) {
                        myTitles=[];
                      }
                      setState(state => ({ ...state,
                        langList,
                        titleList,
                        featuredTitles,
                        myTitles,
                        exclTitles,
                        myLang,
                        channel,
                        loading: false
                      }))
console.log(state)
                      setStateKeyVal("loadingState",loadingStateValue.finishedOk)
                      return Promise.resolve(state)
                    })
                  })
                })
              })
            })
          })
        })
      })
//    return Promise.all(checkConfigPromises)
  }

  const handleConfig = async () => {
console.log("handleConfig")
    const allConfigArr = await getAllConfig()
console.log(allConfigArr)
/*
    let allConfigObj = allConfigArr.reduce((obj, item) => {
      obj[item.configKey] = item.val
      return obj
    }, {})
*/
//    updateLangConfig(allConfigObj,defaultLang,false)
  }
  useEffect(() => {
console.log(getLocale())
    setTimeout(() => {handleConfig()}, 0)
  }, [])

  const handleSelectLang = (lang) => setStateKeyVal("lang",lang)
  const handleSelectLabel = (label) => setStateKeyVal("label",label)

// compare getNavEpItem, getNavHist from qombi-pwa

  const handlerFunctions = {
    setIsPaused: () => console.log("setIsPause"),
    versionStr,
  }
  return (
    <SettingsContext.Provider value={[state, setState, handlerFunctions]}>
      {children}
    </SettingsContext.Provider>
  )
}
export {SettingsContext, SettingsProvider}
