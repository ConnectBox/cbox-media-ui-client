import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import path from 'path'
import { unique } from 'shorthash'
import { pathExistsAsync } from '../utils/file-functions'
import { getLocalMediaFName, uniqueArray } from '../utils/obj-functions'
import Button from '@material-ui/core/Button'
import FolderOpen from '@material-ui/icons/FolderOpen'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListSubheader from '@material-ui/core/ListSubheader'
import Snackbar from '@material-ui/core/Snackbar'
import Chip from '@material-ui/core/Chip'
import ImgGrid from './img-grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import FileDetailsTable from './file-details-table'
import TextFieldSubmit from './text-field-submit'
import CircularProgress from '@material-ui/core/CircularProgress'
import PictureMenu from './picture-menu'
import { checkAudioId, osisFromAudioId } from '../osisAudiobibleId'
import { osisId, checkFreeAudioId, osisFromFreeAudioId } from '../osisFreeAudiobible'
import { pathPatternComponent } from "../utils/config-data"
import useBrowserData from '../hooks/useBrowserData'
import useSettings from "../hooks/useSettings"

const useStyles = makeStyles(theme => ({
  dialog: {
    width: 500,
    minWidth: 400,
    zIndex: 2000,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 400,
    paddingRight: 0,
    color: "rgba(0, 0, 0, 0.770588)",
    fontFamily: "Roboto, sans-serif",
  },
  close: {
    width: 10,
    height: 10,
  },
  groupHeader: {
    display: 'flex',
    paddingTop: 20,
  },
  fixNowGroup: {
    paddingTop: 40,
  },
  dialogTitle: {
    paddingTop: 60,
  },
  progress: {
    height: 100,
    margin: '50px 0px 0 250px',
  },
  grid: {
  },
  table: {
    marginLeft: 40,
  },
  button: {
    height: 50,
    marginTop: -20,
  },
  fixNow: {
    marginLeft: 18,
  },
  chipRoot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
}))

const validExtList = (typeStr) => {
  const tmpValidList = {
    'aud': ['mp3'],
    'epub': ['epub'],
    'pdf': ['pdf'],
    'html': ['html'],
    'vid': ['mp4'],
    'dwnl': ['*'],
  }
  let retList = []
  if (tmpValidList[typeStr]!=null){
    retList=tmpValidList[typeStr]
  }
  return retList
}

const defaultColumnProperties = {
  resizable: true,
}

const EpisodesDialog = (props) => {
  const { width, height } = useBrowserData()
  const { t } = useTranslation()
  const classes = useStyles()
  const { filter, createNew, open,
          pathPattern, onClose, onSave } = props
  const [openSnackbar,setOpenSnackbar] = useState(false)
  const [openRegEx,setOpenRegEx] = useState(false)
  const [curRow,setCurRow] = useState(undefined)
  const [curSelectedPix,setCurSelectedPix] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarMessage,setSnackbarMessage] = useState("")
  const [headerData,setHeaderData] = useState({})
  const [rows,setRows] = useState([])
  const [selectedIndexes,setSelectedIndexes] = useState([])
  const [bibleBookList,setBibleBookList] = useState(props.bibleBookList || [])
  const [isFreeAudiobibleType,setIsFreeAudiobibleType] = useState(false)
  const [biblePathPattern,setBiblePathPattern] = useState(pathPattern || [])
  const [curPath,setCurPath] = useState(props.curPath)
  const [curList,setCurList] = useState([])
  const [epList,setEpList] = useState([])
  const [editMode,setEditMode] = useState(false)
  const [epubReaderOk,setEpubReaderOk] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [biblePath, setBiblePath] = useState(undefined)
  const isBibleContent = (filter === "bible")
  const isEpubContent = (filter === "epub")
  const isDownloadContent = (filter === "dwnl")
  const pathEndsWith = (str) => {
    const len = str.length
    return (curPath.length>=len && curPath.substr(0-len).indexOf(str)===0)
  }
  const isEpubPathOk = curPath && rows && pathEndsWith("epub/library")
  useEffect(() => {if (createNew) handleSelectFolder()}, [])

  const updateRows = (useRows) => {
    setRows(useRows)
    let inUse = false
    if (useRows.length>0) {
      inUse = useRows.filter(item => item.inUse).length>0
      if (inUse && (useRows.filter(item => !item.inUse).length>0)) {
        inUse = undefined
      }
    }
    setHeaderData({inUse})
  }

  const updateCurList = (curList) => {
    if (curList!=null) {
      let tempList = []
      let useRows = curList.map((item,i) => {
        tempList.push(item)
        const fname = path.basename(item.filename)
        let title = item.title
        if (title==null) {
          title = path.basename(fname,path.extname(fname))
        }
        let image = undefined
        if (item.image!=null){
          if(item.image.origin==="Local"){
            image = getLocalMediaFName(item.image.filename)
          }
        }
        return {
          id: i+1,
          title,
          descr: item.descr,
          image,
          fname,
          inUse: true,
        }
      })
      updateRows(useRows)
      setCurList(curList)
      setEpList(tempList)
    }
  }
  const verifyEpubInstall = async (checkPath) => {
    let isFound = checkPath && (checkPath.length>0)
    if (isFound) {
      const usePath = checkPath.substring(0,checkPath.length-7)
      isFound = await pathExistsAsync(usePath +"scripts/readium-js-viewer_all_LITE.js")
    }
    setEpubReaderOk(isFound)
  }
  useEffect(() => {
    updateCurList(props.epList)
    isEpubContent && verifyEpubInstall(curPath)
  }, [props.epList])

  const getAllFilesInfo = async (pathName) => {}

  const verifiedExt = (extStr) => {
    let checkStr = extStr.substring(1,extStr.length)
    const tmpValidExtList = validExtList(filter)
    return (tmpValidExtList.findIndex(item => checkStr.toLowerCase() === item.toLowerCase())>=0)
  }

  const setFilelist = (checkFiles) => {}
  const getFiles = (pathName) => {}

  const analysePathPattern = (pathStr) => {
    let retPattern
    const findRegExChFirst = /([A-B]\d\d)(_+)(\d+)(_+)([A-Z,a-z,0-9]+)(_+.*)/
    const match1 = findRegExChFirst.exec(pathStr)
    if (match1!=null){
      retPattern = [
        pathPatternComponent.bookAB,
        match1[2],
        pathPatternComponent.chapter,
        match1[4],
        pathPatternComponent.bookEng,
        match1[6],
      ]
    } else {
      const findRegExChLast = /([A-B]\d\d)(_+)([A-Z,a-z,0-9]+)(_+)(\d+)(_+.*)/
      const match2 = findRegExChLast.exec(pathStr)
      if (match2!=null){
        retPattern = [
          pathPatternComponent.bookAB,
          match2[2],
          pathPatternComponent.bookEng,
          match2[4],
          pathPatternComponent.chapter,
          match2[6],
        ]
      }
    }
    return retPattern
  }

  const setBibleBooks = (checkFiles) => {
    const freeAudioInx = checkFiles.findIndex(f => {
      return (path.basename(f.filePath) === "PSA150.mp3")
    })
    const hasFree = (freeAudioInx>=0)
    let firstValidFile
    setIsFreeAudiobibleType(hasFree)
    let nextBibleBookList = uniqueArray(
      checkFiles.map(file => {
        if (!file.isDirectory){
          const fName = path.basename(file.filePath)
          if (!firstValidFile) firstValidFile = fName
          return fName.substr(0,3)
        }
        return false
      }).filter(prefix => {
        return hasFree ? checkFreeAudioId(prefix) : checkAudioId(prefix)
      })
    ).map(prefix => hasFree ? osisFromFreeAudioId(prefix) : osisFromAudioId(prefix))
    setBibleBookList(nextBibleBookList)
    if (!hasFree) setBiblePathPattern(analysePathPattern(firstValidFile))
  }

  const getBibleBooks = (pathName) => {
    if ((pathName!=null)&&(pathName.length>0)&&(path.basename(pathName)!==".")){
      setBiblePath(pathName)
    }
  }

  const handleSelectFolder = () => {
//    const resObj = window.showOpenDialog()
  }
  const handleSave = () => {}
  const openFile = () => {
// Possible alternative for later? Import from any local location
//  and copy to the configure local directory
//        updateRows(rowsCopy)
  }

  const handleDeleteRow = (row) => {
    if (row!=null){
      const rowsCopy = [...rows]
      rowsCopy[row].inUse = false
      updateRows(rowsCopy)
    }
  }

  const handleUpdateCol = (ev,row, col) => {
    if (col==="image") {
      setCurRow(row)
      setCurSelectedPix(rows[row].image)
      setAnchorEl(ev.currentTarget)
    } else if (col==="inUse") {
      let rowsCopy
      if (row!=null){
        rowsCopy = [...rows]
        if (rowsCopy[row].inUse!=null){
          rowsCopy[row].inUse = !rowsCopy[row].inUse
        }
      } else {
        if (headerData.inUse) {
          rowsCopy = rows.map(row => {
            return {...row, inUse: false}
          })
        } else {
          rowsCopy = rows.map(row => {
            return {...row, inUse: true}
          })
        }
      }
      updateRows(rowsCopy)
    }
  }

  const handleSelectImage = (x) => {
    const rowsCopy = [...rows]
    rowsCopy[curRow].image = x.urls.thumb
    updateRows(rowsCopy)
    const epListCopy = [...epList]
    epListCopy[curRow].image = x
    setEpList(epListCopy)
	}

  const handleSnackbarClose = () => setOpenSnackbar(false)
  const handlePixChoice = (ev) => {
    setAnchorEl(ev.currentTarget)
  }
  const handleSelectImageFileClick = (ev) => {
    openFile()
    setAnchorEl(undefined)
  }

  const ensureEpubPathOk = async () => {}
  const handleFileDetailUpdate = (rowNbr,rowData) => {
    const rowsCopy = [...rows]
    rowsCopy[rowNbr] = rowData
    updateRows(rowsCopy)
  }

  const getSort = (val) => osisId.indexOf(val)
  const empty = rows.length<=0 && (!isBibleContent || bibleBookList.length<=0)
  const showEpubReaderMsg = (isEpubContent && !empty && isEpubPathOk &&!epubReaderOk)
  const showFixNow = isEpubContent && !empty && !isEpubPathOk
  const getTitle = (
    isBibleContent ? t("bibleBook_plural") :
    isEpubContent ? t("book_plural") :
    isDownloadContent ? t("file_plural") :
    t("episode",{count: 100})
  )
  const renderHeader = (headerStr) => (
    <ListSubheader className={classes.subheader}>{headerStr}</ListSubheader>
  )
  const getPatternTitle = (part) => {
    if (part===1) return "FCBH ID"
    else if (part===2) return t("bibleBook")
    else if (part===3) return t("chapter")
    return part
  }
  const renderPattern = (pattern) => (
    <div>
      {pattern && pattern.map((part,inx) => (
        <Chip key={inx} label={getPatternTitle(part)} className={classes.chip} />
      ))}
    </div>
  )
  const listActions = [
    <Button
      key="close"
      color="primary"
      variant="contained"
      onClick={onClose}>
      {t("cancel")}
    </Button>,
    <Button
      key="save"
      color="primary"
      variant="contained"
      disabled={editMode || showFixNow || showEpubReaderMsg || empty}
      onClick={handleSave}>
      {t("ok")}
    </Button>
  ]
  return (
    <Dialog
      fullScreen
      disableBackdropClick
      disableEscapeKeyDown
      onClose={onClose}
      open={open}
    >
      <div className={classes.groupHeader}>
        {renderHeader(t("path")+":")}
        {(curPath!=null) && renderHeader(curPath)}
        <div className={classes.groupHeader}>
          <IconButton
            className={classes.button}
            color="primary"
            onClick={handleSelectFolder}>
            <FolderOpen/>
          </IconButton>
        </div>
      </div>
      {biblePathPattern && (biblePathPattern.length>0) && (
        <div className={classes.groupHeader}>
          {renderHeader(t("pattern")+":")}
          {renderPattern(biblePathPattern)}
        </div>
      )}
      {(isWaiting)
        && (<CircularProgress
          className={classes.progress}
          variant="indeterminate"
          size={75} />)}
      {showFixNow && (
        <div className={classes.fixNowGroup}>
          {renderHeader(t("pleaseNote") + ": " +t("epubPathMsg"))}
          <Button
            key="fixNow"
            className={classes.fixNow}
            color="primary"
            variant="contained"
            onClick={() => ensureEpubPathOk()}
          >
            {t("fixNow")}
          </Button>
        </div>
      )}
      {showEpubReaderMsg && (
        <div className={classes.fixNowGroup}>
          {renderHeader(t("pleaseNote") + ": " +t("epubReaderMsg"))}
          <Button
            key="fixNow"
            className={classes.fixNow}
            color="primary"
            variant="contained"
            onClick={() => console.log("Epub click")}
          >
            {t("fixNow")}
          </Button>
        </div>
      )}
      <DialogTitle
        className={classes.dialogTitle}
        id="episodes-title">{getTitle}
      </DialogTitle>
      {isBibleContent && (<div className={classes.chipRoot}>
        {bibleBookList.sort((a,b)=>getSort(a)-getSort(b)).map((book,inx) => {
          return (<Chip key={inx} label={book} className={classes.chip} />)
        })}
      </div>)}
      {!isBibleContent && (
        <div className={classes.table}>
          <FileDetailsTable
            padding="none"
            headerData={headerData}
            data={rows}
            onUpdateCell={handleFileDetailUpdate}
            onUpdateCol={(ev,row,col) => handleUpdateCol(ev,row,col)}
            onDeleteRow={(row) => handleDeleteRow(row)}
            onEditMode={(isEditMode) => setEditMode(isEditMode)}
          />
        </div>
      )}
      <DialogActions>{listActions}</DialogActions>
        <PictureMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onSelectImageFileClick={(event) => handleSelectImageFileClick(event)}
          onClose={() => setAnchorEl(undefined)}
        />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{snackbarMessage}</span>}
        action={[
          <Button
            key="undo"
            color="secondary"
            size="small"
            onClick={handleSnackbarClose}
          >
            {t("ok")}
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
     />
    </Dialog>
  )
}

export default EpisodesDialog
