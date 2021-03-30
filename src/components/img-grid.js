import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import './img-grid.css'
import { getHostPathSep, getRelPath } from '../utils/file-functions'
import { isPathInsideUsb, getLocalMediaFName,
            removeOrgPathPrefix } from '../utils/obj-functions'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import SearchForm from './SearchForm'
import Button from '@material-ui/core/Button'
import { Upload } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import useBrowserData from '../hooks/useBrowserData'
import useSettings from "../hooks/useSettings"

const styles = {
  button: {
    left: '91%',
  },
  mainSearchDiv: {
  },
  title: {
    marginLeft: 15,
  },
  image: {
    margin: '18px 0 0 24px',
    maxWidth: 100,
    maxHeight: 100,
    width: "auto",
    height: "auto"
  },
  search: {
    top: 40,
    paddingLeft: 20,
    margin: '0 auto',
    maxWidth: 800
  },
  grpDiv: {
    paddingBottom: 10,
  },
}

const ImgGrid = (props) => {
  const { width, height } = useBrowserData()
  const { usbPath, accessToken } = useSettings()
  const { open, imgSrc, onSave, onClose } = props
  const { t } = useTranslation()
  const [useImgSrc, setUseImgSrc] = useState(undefined)
  const [imgs, setImgs] = useState([])
  const [curQueryStr, setCurQueryStr] = useState("")
  const [curPage, setCurPage] = useState(1)
  const [curImage, setCurImage] = useState(undefined)
  const [loadingState, setLoadingState] = useState(false)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadingText, setDownloadingText] = useState("")
  const [progressText, setProgressText] = useState("")
  const [percentProgress, setPercentProgress] = useState(0)

  const uniqueArrayByThumb = (a,b) => a.filter(aItem => !b.some(bItem => {
    return aItem.urls.thumb === bItem.urls.thumb
  }))

  let mapppedImgList = []
  if (imgs!=null) {
    mapppedImgList = imgs.map((item) => {
      return {
        img: item.urls.thumb,
        descr: item.description || item.alt_description,
        link: item.links.html,
        author: item.user.name,
        userImg: item.user.profile_image.small,
        userLink: item.user.links.html,
      }
    })
  }
//    const loader = <div className="loader">Loading ...</div>
  let pixsActions = [
    <Button
      key="cancel"
      color="primary"
      variant="contained"
      onClick={onClose}>
      {t("cancel")}
    </Button>
  ]
  const isConnected = accessToken
  if (!isConnected){
    pixsActions.push(
        (<Button
          key="connect"
          color="primary"
          variant="contained">
          {t("connect")}
        </Button>))
  }
  var items = []
  mapppedImgList.forEach((item, i) => {
      items.push(
          <div className="track" key={i}>
              <img src={item.src} width="150" height="150" alt={i}/>
          </div>
      )
  })
  const hideMoreButton = (items.length<=0) || loadingState || isDownloading
  return (
    <Dialog
      fullScreen
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="select-picture-title">
        {(useImgSrc!=null) && (<img style={styles.image}
                                    src={getLocalMediaFName(usbPath,useImgSrc)}
                                    alt="selected"/>)}
        <span style={styles.title}>
          {t("selectImage")}
        </span>
      </DialogTitle>
      <div className="main-search-form" style={styles.mainSearchDiv}>
        {loadingState || isDownloading || !isConnected
          ? null
          : (
            <div style={styles.grpDiv}>
              <div style={styles.search}>
                <SearchForm autoFocus={true} onSearch={console.log("onSearch")}/>
              </div>
            </div>
        )}
      </div>
      <DialogActions>{pixsActions}</DialogActions>
    </Dialog>
  )
}

export default ImgGrid
