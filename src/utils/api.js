import axios from "axios"
import localforage from 'localforage'
import { unique } from 'shorthash'

export const getIdFromItem = (curSerie) => {
  let retStr = ""
  if ((curSerie!=null)){
    const titleIdStr = unique(curSerie.title)
    retStr = titleIdStr
  }
  return retStr
}

export const getIdStr = (curObj,field) => {
  let retStr = ""
  if ((curObj!=null) && (curObj.curSerie!=null)&&(curObj.curSerie.title!=null)){
    const titleIdStr = unique(curObj.curSerie.title)
    retStr = `${curObj.curSerie.language  }_${  titleIdStr}`
    if (curObj.curEp!=null){
      if (!curObj.curEp.bibleType){
        retStr += "_" + curObj.curEp.id
      } else retStr += "_" + curObj.curEp.bk + "_" + curObj.curEp.id
    }
    retStr = `${retStr  }_${  field}`
  }
  return retStr
}

export const apiGetConfig = async (confIdStr) => {
  let response, resData // or use `var` inside the block
  try {
    const regex = new RegExp('export\\s*var\\s*(\\S*)\\s*=\\s*([\\s\\S]*)')
    response = await await axios.get("config/mediaUI/"+confIdStr+".js")
    resData = regex.exec(response.data)
    if (resData!=null){
      const resList = JSON.parse(resData[2])
console.log(resList)
        return Promise.resolve(resList)
      }
  } catch (error) {
      console.error(error) // from axios
      return Promise.resolve([]) // empty list
  }
  return Promise.reject("Config error in "+confIdStr)
}

export const apiSetStorage = (key,value) => localforage.setItem(key,value)

export const apiGetStorage = async (key) => {
  return localforage.getItem(key).then(async function(value) {
    return Promise.resolve(value)
  }).catch(function(err) {
    console.log(err)
  })
}

export const apiObjSetStorage = (obj,field,value) => apiSetStorage(getIdStr(obj,field),value)

export const apiObjGetStorage = async (obj,field) => apiGetStorage(getIdStr(obj,field))

export const apiGetStoreItem = async (key) => {
  return localforage.getItem(key).then(async function(value) {
    if (value!=null){
      return Promise.resolve(value)
    } else {
      const response = await apiGetConfig(key)
      if (response!=null){
        localforage.setItem(key,response)
        return Promise.resolve(response)
      }
    }
    return Promise.reject("apiGetStore error: "+key)
  }).catch(function(err) {
    console.log(err)
  })
}
