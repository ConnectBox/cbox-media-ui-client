import url from 'url'

export const isEmpty = obj => ((obj==null) || (Object.getOwnPropertyNames(obj).length === 0))
export const isEmptyObj = obj => ((isEmpty(obj)) || (Object.keys(obj).length === 0))

export const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

export const rangeArray = (beg, end) => Array.from(Array(end+1-beg),(val,index)=>index+beg)

export const arrayRemove = (array, element) =>
  array.filter(el => el !== element)

export const arrayInsert = (array, i, ...rest) =>
  array.slice(0,i).concat(rest,array.slice(i))

export const getLocFilePrefix = () => {
  let retStr = ""
  return retStr
}

export const jsonCopy = (obj) => JSON.parse(JSON.stringify(obj))

export const getLocalImgFName = (remoteUrl, key) => {
  const checkURL = url.parse(remoteUrl)
//  return "x/" + checkURL.host + checkURL.pathname + "-" + key + ".jpg"
  return "x/" + checkURL.host + checkURL.pathname + "-" + key + ".jpg"
}

export const getLocalMediaFName = (url) => encodeURI(process.env.PUBLIC_URL +"/" + url)

export const getImgOfType = (type) => {
  let retStr = "/icon/clapperboard.png"
  if (type==="aud"){
    retStr = "/icon/headphones.png"
  } else if (type==="epub"){
    retStr = "/icon/book.png"
  } else if (type==="html"){
    retStr = "/icon/education.png"
  }
  return retStr
}

export const getImgOfObj = (ser) => {
  let retStr = "img/Placeholder.png"
  if (ser!=null){
    if(ser.image!=null){
      if((ser.image.origin==="Unsplash")
        &&(ser.image.urls!=null)
        &&(ser.image.urls.raw!=null)){
        retStr = getLocalImgFName(ser.image.urls.raw,"small")
      } else if((ser.image.origin==="Local")
        &&(ser.image.filename!=null)){
        retStr = ser.image.filename
      } else if((ser.image.origin==="Url")
        &&(ser.image.filename!=null)){
        retStr = ser.image.filename
      }
    } else if (ser.index!=null){
      retStr = "img/ser" + pad((ser.index) % 41) + ".jpg"
    }
  }
  return retStr
}

export const pad = (n) => ((n < 10) && (n >=0)) ? (`0${  n}`) : n
export const removeAllDigits = str => str.replace(/\d/g, "")
export const keepAllDigits = str => str.replace(/\D/g, "")
export const uniqueArray = array => [ ...new Set(array)]
export const nbrOfKeysInObj = obj => ((obj==null) ? 0 : Object.getOwnPropertyNames(obj).length )
export const jsonEqual = (a,b) => JSON.stringify(a) === JSON.stringify(b)

export const nullToEmptyStr = str => {
  if (str==null){
    return ""
  } // else
  return str
}

export const removeEqualEndOfStr = (a, b) => {
  let resStr = ""
  let diffFound = false
  for (let i = a.length-1; i >= 0; i--) {
    if (diffFound || (a[i]!==b[i])){
      diffFound = true
      resStr = a[i] + resStr
    }
  }
  return resStr
}

export const turnBackToSlash = (thePath) => {
  let retStr = thePath
  if (thePath) {
    retStr = thePath.replace(/\\/g, '/')
  }
  return retStr
}

export const turnToBackslash = (thePath) => {
  let retStr = thePath || ""
  if (thePath) {
    const tmpPath = thePath.replace(/\//g, '\\')
    retStr = tmpPath.replace(/\\\\/g, '\\')
  }
  return retStr
}

export const removePathPrefix = (thePath) => {
  let retStr = thePath.replace(/^cbox:\//, '')
  if (thePath) {
    retStr = thePath.replace(/^file:\/\//g, '')
  }
  return retStr
}

const getOrgPathPrefix = (orgPath) => {
  return getLocFilePrefix()+turnBackToSlash(orgPath)
}

export const removeOrgPathPrefix = (orgPath,thePath) => {
  const checkPathPrefix = getOrgPathPrefix(orgPath)
  const retStr = thePath.replace(checkPathPrefix, '')
  return retStr
}

/* Example mapped function on object
const oMap = (o, f) => Object.assign(...Object.keys(o).map(k => ({ [k]: f(o[k]) })))
// For instance - square of each value:
let mappedObj = oMap(myObj, (x) => x * x)
*/
