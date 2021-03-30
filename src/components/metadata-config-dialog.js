import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import path from 'path'
import { getImgOfObj, isEmpty,
          jsonEqual, nullToEmptyStr } from '../utils/obj-functions'
import { getHostPathSep } from '../utils/file-functions'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Checkbox from '@material-ui/core/Checkbox'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ActionList from '@material-ui/icons/List'
import ImageCollections from '@material-ui/icons/Collections'
import TextField from '@material-ui/core/TextField'
import TranslateIcon from '@material-ui/icons/Translate'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { LanguageSelect } from './language-select'
import ImgGrid from './img-grid'
import PictureMenu from './picture-menu'
import EpisodesDialog from './episodes-dialog'
import Typography from '@material-ui/core/Typography'
import {iso639Langs} from '../iso639-1-full.js'
import { useTranslation } from 'react-i18next'
import useBrowserData from '../hooks/useBrowserData'
import useSettings from "../hooks/useSettings"

const styles = {
  card: {
    height: '100%',
  },
  dialog: {
    width: 500,
    minWidth: 400,
    zIndex: 2000,
  },
  image: {
    margin: '18px 0 0 24px',
    cursor: 'pointer',
    maxWidth: 180,
    maxHeight: 180,
    width: "auto",
    height: "auto"
  },
  textField: {
    width: '85%',
    minWidth: 180,
  },
  helpHeader: {
    paddingBottom: 20,
    paddingLeft: 16,
    fontSize: 14,
    fontWeight: 200,
    color: "grey",
    fontFamily: "Roboto, sans-serif",
  },
  seriesModeIcon: {
    right: -20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  langSelect: {
    marginTop: 10,
    marginLeft: 0,
  },
  button: {
    marginLeft: 20,
  },
  buttonLabelOn: {
    whiteSpace: "nowrap",
  },
  buttonLabelOff: {
    whiteSpace: "nowrap",
    color: "rgba(0, 0, 0, 0.770588)",
  },
  floatingButtonEdit: {
    left: 165,
    top: 150,
    width: 65,
    zIndex: 100,
    position: 'relative',
  },
  textFieldNumber: {
    paddingLeft: 20,
  },
  checkbox: {
    marginLeft: 20,
    width: "auto",
    maxWidth: "50%",
  },
}

const MetadataConfigDialog = (props) => {
  const { width, height } = useBrowserData()
  const { languages, handleAddTitle } = useSettings()
  const { t } = useTranslation()
  const { backgroundColor, createNew, item, open,
          isSelectedSerie, onClose } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const [lang, setLang] = useState("eng")
  const [filter, setFilter] = useState(undefined)
  const [canSelectLang,setCanSelectLang] = useState(lang==null)
  const [eItem, setEItem] = useState({})
  const [dataOk, setDataOk] = useState(false)
  const [allEmpty, setAllEmpty] = useState(false)
  const [changedField, setChangedField] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [openListDialog, setOpenListDialog] = useState(false)
  const [epDialogHandled, setEpDialogHandled] = useState(false)
  const isList = (eItem!=null)&&(eItem.fileList!=null)
  const verifyData = (dataObj,checkField) => {
    let copyItem = {}
    if (dataObj!=null){
      copyItem = JSON.parse(JSON.stringify(dataObj))
    }
    const tmpDataOk = ( (copyItem.image!=null)
                      && (copyItem.mediaType!=null)
                      && (copyItem.lang!=null)
                      && (copyItem.title!=null)
                      && (copyItem.language!=null) )
    const tmpAllEmpty = ( isEmpty(copyItem.image)
                        && isEmpty(copyItem.mediaType)
                        && isEmpty(copyItem.title)
                        && isEmpty(copyItem.lang)
                        && isEmpty(copyItem.description)
                        && isEmpty(copyItem.language) )
    const tmpChangedField = ( checkField
                                && !isEmpty(item)
                                && !jsonEqual(copyItem,item) )
    setEItem(copyItem)
    setDataOk(tmpDataOk)
    setAllEmpty(tmpAllEmpty)
    setChangedField(tmpChangedField)
/*
    if (onEditModeChange!=null){
      onEditModeChange(eMode)
    }
*/
  }
  useEffect(() => {
    if ((createNew)&&(!epDialogHandled)) {
      setOpenListDialog(true)
      setEpDialogHandled(true)
    }
    verifyData(item)
console.log(item)
  }, [item,lang])
  useEffect(() => {
    if (props.filter!=null){
      setFilter(props.filter)
    } else if (item) {
      setFilter(item.mediaType)
    }
  }, [item,props.filter])
/*
  useEffect(() => {
    let canSelect = true
    if (lang!=null){
      setLang(lang)
      canSelect = false
    } else if (item && item.language) {
      setLang(item.language)
      canSelect = false
    }
    setCanSelectLang(canSelect)
  }, [item,lang])
*/
	const handleSelectImage = (x) => {
    let tmpObj = eItem
		tmpObj.image = x
    verifyData(tmpObj,true)
	}

//  const handleClose = () => setAnchorEl(null)
  const handlePixChoice = (ev) => {
    setAnchorEl(ev.currentTarget)
  }
  const handleSelectImageFileClick = (ev) => {
//    openFile()
    setAnchorEl(undefined)
  }
  const handleOpenListDialog = () => setOpenListDialog(true)
  const handleLangSelect = (newLang) => {
console.log(newLang[0])
    setLang(newLang[0].value)
  }

	const handleClose = () => {
    verifyData(item)
    setEpDialogHandled(false)
    onClose()
  }

  const handleCloseListDialog = () => {
    setOpenListDialog(false)
    handleClose()
	}

  const handleSaveListDialog = (list,curPath,isFreeAudiobibleType,pathPattern) => {
    const isBibleContent = (filter === "bible")
    const copy = Object.assign({}, eItem)
    setOpenListDialog(false)
    if (isBibleContent){
      copy.bibleBookList=list
      copy.freeType = isFreeAudiobibleType
      copy.pathPattern = pathPattern
    } else {
      copy.fileList=list
    }
    copy.curPath=curPath
    verifyData(copy,true)
  }

  const openFile = () => {
// The host needs to allow upload of a file
  }

  const handleSave = () => {
    // The host needs to allow upload of a file
	}

  const onFieldChange = (event,inputName) => {
    let tmpObj = eItem
    tmpObj[inputName] = event.target.value
    verifyData(tmpObj,true)
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false)
  }

  const onCheck = (event,inputName) => {
    const isChecked = event.target.checked
    let tmpObj = eItem
    tmpObj[inputName] = isChecked
    verifyData(tmpObj,true)
  }

  const renderCheckBox = (textStr,field) => {
    return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={eItem[field] || false}
          onChange={(e) => onCheck(e, field)}
        />
      }
      label={textStr}
    />
  )}

  const renderTextField = (label,hint,field,errorText) => (
    <TextField
      value={nullToEmptyStr(eItem[field])}
      onChange={(e) => onFieldChange(e, field)}
      style={styles.textField}
      margin="dense"
      placeholder={hint}
      label={label}
    />
  )

  let badgeCnt = 0
  let imgSrc = ""
  if (eItem!=null){
    if (eItem.fileList!=null){
      badgeCnt = eItem.fileList.length
    }
    imgSrc = getImgOfObj(eItem)
  }
  let langStr = "undefined"
  if (lang!=null){
    langStr = iso639Langs[lang].name + " (" +iso639Langs[lang].engName +")"
  }
  const isBook = (filter==="epub")
  const isBibleContent = (filter === "bible")
  const isAVContent = (filter === "aud") || (filter === "vid")
//  const saveDisabled = (eItem.title==null)||(eItem.title.length<=0)||(lang==null)
  const saveDisabled = true
  const showWarning = false // isBook && !saveDisabled
  return (
    <Dialog
      open={open}
      disableBackdropClick
      onClose={() => handleClose()}
      aria-labelledby="form-dialog-title"
      style={{backgroundColor}}
    >
      {(eItem!=null) && (
        <Button
          style={styles.floatingButtonEdit}
          color="primary"
          variant="contained"
          onClick={(ev) => handlePixChoice(ev)}>
          <ImageCollections />
        </Button>
      )}
      {(eItem!=null) && (
        <img
          src={imgSrc}
          alt={eItem.title}
          style={styles.image}
          onClick={(ev) => handlePixChoice(ev)}/>
      )}
      <DialogContent>
        <Typography
          color={(lang==null) ? "error" : "primary"}
          type="title"
        >{t("language")}: {langStr}</Typography>
        {canSelectLang && (
          <LanguageSelect
            style={styles.langSelect}
            languages={languages}
            isSearchable={true}
            selLang={[lang]}
            onLanguageUpdate={handleLangSelect}
          />
        )}
        {renderTextField(t("title"),t("mainTitle"),"title")}
        {renderTextField(t("description"),t("descr"),"description")}
        {renderCheckBox(t("download"),"download")}
        {isBook && renderCheckBox(t("readOL"),"readOL")}
        <CardActions>
          {(!isList)||(badgeCnt===0)
          ? (<Button
              color="primary"
              onClick={handleOpenListDialog}>
              <ActionList />
            </Button>)
          : (<Badge
            badgeContent={badgeCnt}
          >
            <Button
              color="primary"
              onClick={handleOpenListDialog}>
              <ActionList />
            </Button>
          </Badge>)}
        </CardActions>
        {openListDialog
          && (<EpisodesDialog
            onClose={handleCloseListDialog}
            onSave={handleSaveListDialog}
            filter={filter}
            epList={eItem.fileList}
            bibleBookList={eItem.bibleBookList}
            pathPattern={eItem.pathPattern}
            curPath={eItem.curPath}
            createNew={createNew}
            open={true}
          />)}
        {showWarning && <Typography align="right" type="title">{t("unzipNotice")}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleClose}>
          {t("cancel")}
        </Button>
        {((eItem!=null) || (changedField))
          && (<Button
            color="primary"
            variant="contained"
            disabled={saveDisabled}
            onClick={handleSave}>
            {t("save")}
          </Button>
        )}
      </DialogActions>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        SnackbarContentProps={{
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
            style={styles.close}
            onClick={handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Dialog>
  )
}

/*
*/

export default MetadataConfigDialog
