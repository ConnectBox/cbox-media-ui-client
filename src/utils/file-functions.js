import { iso639_3b2 } from '../iso639-3b2'
import locale2 from 'locale2'

export const readFileAsync = (fname, encoding) => {
  console.log("readFileAsync")
}
export const readJsonAsync = fname => {
  console.log("readJsonAsync")
}
export const readJson = fname => {
  console.log("readJson")
}
export const ajaxGetFileAsync = (url) => {
  return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.addEventListener("error", reject)
      xhr.addEventListener("load", resolve)
      xhr.open("GET", url)
      xhr.send(null)
  })
}
export const downloadFiles = (filelist,listProgress,donwloadProgress) => {
  console.log("downloadFiles")
}
export const getLocale = () => iso639_3b2[locale2.substr(0,2)]
export const getLocaleIso639Letter2 = () => locale2.substr(0,2)
export const unixPathSep = "/"
export const getHostPathSep = () => unixPathSep
