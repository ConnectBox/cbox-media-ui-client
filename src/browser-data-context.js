import React, { useState, useEffect } from 'react'
import { apiGetStorage, apiSetStorage } from './utils/api'
import locale2 from 'locale2'
import { iso639_3b2 } from './iso639-3b2'
import { iso639Langs } from './iso639-1-full'

const BrowserDataContext = React.createContext([{}, () => {}])
const BrowserDataProvider = ({children}) => {
  const [state, setState] = useState({ width: 400, height: 100,
                                       size: "xs", orientation: "landscape" })
  const setStateKeyVal = (key,val) => setState(state => ({ ...state, [key]: val }))
  useEffect(() => {
    const updateSize = () => {
      const clientWidth = (typeof window !== `undefined`) ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : 400
      const clientHeight = (typeof window !== `undefined`) ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : 400
      setStateKeyVal("width",clientWidth)
      setStateKeyVal("height",clientHeight)
      setStateKeyVal("orientation",(clientWidth > clientHeight) ? "landscape" : "portrait")
      let s = "xs"
      if (clientWidth>=1200) s = "xl"
      else if (clientWidth>=992) s = "lg"
      else if (clientWidth>=768) s = "md"
      else if (clientWidth>=576) s = "sm"
      setStateKeyVal("size",s)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  },[])

  useEffect(() => {
/*
window.ipcRendererOn('locale',(event, value) => {
  let lang = "eng" // Default
  if ((value!=null)&&(value.length>=2)){
    lang = iso639_3b2[value.substr(0,2)]
    if (lang==null){
      lang="eng" // Default
    }
  }
*/
    const getCurLang = async () => {
      let retVal = await apiGetStorage("curLang")
      if (!retVal){
        const checkLang = iso639_3b2[locale2.substr(0,2)]
      }
      return retVal
    }
    const curLang = getCurLang()
    setState(state => ({ ...state, curLang}))
  },[])


  return (
    <BrowserDataContext.Provider value={[state, setState]}>
      {children}
    </BrowserDataContext.Provider>
  )
}
export {BrowserDataContext, BrowserDataProvider}
