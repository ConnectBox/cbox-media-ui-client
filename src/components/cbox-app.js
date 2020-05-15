import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import * as Router from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from "@material-ui/icons/Close"
import ItemList  from './item-list'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import Snackbar from '@material-ui/core/Snackbar'
import { BookOpen, TestTube } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { matchPath } from 'react-router'
import CBoxAppBar from './cbox-app-bar'
import CboxMenuList from './cbox-menu-list'
import { isEmptyObj } from '../utils/obj-functions'
import { NavLangSelect, LanguageSelect } from './language-select'
import CboxBibleNavigation from './cbox-bible-navigation'
import { iso639Langs } from '../iso639-1-full.js'
import { iso639_3b2 } from '../iso639-3b2'
import { loadingStateValue } from '../utils/config-data'
import useMediaPlayer from "../hooks/useMediaPlayer"
import useBrowserData from "../hooks/useBrowserData"
import useSettings from "../hooks/useSettings"

const defaultBackgroundStyle = {
  height: 'auto',
  minHeight: '100%',
  background: 'black'
}

const versionStr = 'Version 2.20'

const useStyles = makeStyles(theme => ({
  iFrame: {
    overflow: 'visible',
    width: '100%',
  },
  menuTitle: {
    margin: '15px 0px 4px 20px',
  },
  checkBox: {
    margin: '15px 0px 4px 20px',
  },
  aboutTitle: {
    margin: '10px 0px 4px 50px',
  },
  aboutMainTitle: {
    paddingTop: 20,
    margin: '15px 0px 4px 50px',
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 25,
  },
  topButton: {
    margin: 10,
  },
  floatingButton: {
    margin: 0,
    bottom: 'auto',
    left: 20,
    top: 20,
    right: 'auto',
    zIndex: 100,
    position: 'fixed',
  },
  navBackButton: {
    margin: 10,
    bottom: 'auto',
    left: 20,
    top: 20,
    right: 'auto',
  },
  configButton: {
    color: 'grey',
    marginLeft: 40,
    width: 100,
  },
  drawerPaperSmall: {
    width: '75%',
  },
  drawerPaperLarge: {
    width: 500,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  aboutTitle: {
    margin: '15px 0px 4px 50px',
  },
  aboutMainTitle: {
    paddingTop: 20,
    margin: '15px 0px 4px 50px',
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 25,
  },
  title: {
    cursor: 'pointer',
  },
  smallText: {
    position: 'absolute',
    right: 10,
    top: 70,
    fontSize: 10,
  },
}))

const lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Router.Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest)
    }}/>
  )
}

const CboxApp = (props) => {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [changedGUID, setChangedGUID] = useState(false)
  const [chEditMode, setChEditMode] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [verifiedPaths, setVerifiedPaths] = useState([])
  const [requiredReload, setRequiredReload] = useState(false)
// translation path - for instance: "/location/data.en.properties"

  const settings = useSettings()
  const { loadingState, channel,
          percentList, percentDownload,
          versionStr,
          progressTextList, progressTextDownload,
          titles, languages,
          featuredList, myLang,
          handleLangUpdate, handleMyLangUpdate,
          updateChannelTitle, updatePageLayout,
          updateTranslation, addLang, addLabel,
          defaultLang } = settings
  const { t } = useTranslation()
  const classes = useStyles()
  const { width } = useBrowserData()
  const { playNext, startPlay, isPaused, setIsPaused,
          curPlay, curPos } = useMediaPlayer()
  const handleClose = () => setOpen(false)
  const handleEditClose = (history) => history.goBack()

  const handleStartBiblePlay = (curSerie,bookObj,id) => {
    const {bk} = bookObj
    const curEp = {bibleType: true,bk,id}
    setIsPaused(false)
    startPlay(id,curSerie,curEp)
  }

  const handleExitBibleNavigation = () => {
    startPlay(undefined)
    setIsPaused(false)
  }
/*
  state = {
    open: false,
    langOpen: false,
    isPaused: false,
    isWaitingForPlayInfo: false,
    curCheckPos: undefined,
    editMode: false,
    size: "xs",
    orientation: undefined,
    showAll: false,
    containerWidth: this.calcContainerWidth(),
    containerHeight: this.calcContainerHeight(),
  }

  calcContainerWidth() {
    let retVal = verge.viewportW()
    return retVal
  }

  calcContainerHeight() {
    let retVal = verge.viewportH()
    return retVal
  }

  calcSize(){
    const containerWidth = this.calcContainerWidth()
    const containerHeight = this.calcContainerHeight()
    const orientation = containerWidth > containerHeight ? "landscape" : "portrait"
    let size = "xs"
    if (containerWidth>=1200){
      size = "xl"
    } else if (containerWidth>=992){
      size = "lg"
    } else if (containerWidth>=768){
      size = "md"
    } else if (containerWidth>=576){
      size = "sm"
    }
    this.setState({containerHeight, containerWidth, size, orientation})
  }
*/

const Home = (props) => {
  const largeScreen = (width>=768)
  const chDefExists = ((channel!=null)
                      && (channel.title!=null))
  let isCurBible = false
  let curBiblePlay
  if (curPlay!=null) curBiblePlay = JSON.parse(JSON.stringify(curPlay))
  if ((curPlay!=null)&&(curPlay.curSerie!=null)&&(curPlay.curSerie.mediaType!=null)){
    isCurBible = (curPlay.curSerie.mediaType==="bible")
    if (isCurBible) curBiblePlay.curEp = undefined
  }
  const loading = (loadingState!==loadingStateValue.finishedOk)
console.log(loading)
  return (
//    <div style={(curView!=null)? defaultBackgroundStyle : null}>
  <div style={defaultBackgroundStyle}>
    <CBoxAppBar
      displayMenu={true}
      onLeftIconButtonClick={() => setOpen(!open)}
    />
    {isCurBible && (<CboxBibleNavigation
      isPaused={isPaused}
      onReset={props.onReset}
      onExitNavigation={handleExitBibleNavigation}
    />)}
    {(!loading) && !isCurBible && (<ItemList
      filter=''
      onReset={props.onReset}
      largeScreen={largeScreen}
      curPlay={isCurBible ? curBiblePlay : curPlay}
    />)}
  </div>
)}

/*
    const { channel, myTitles, featuredList, titles,
            myLang, curPlay, curPos, loading } = props

    let showObj = featuredList
    if (showAll) {
      Object.keys(titles).forEach(lang => {
        showObj[lang] = Object.keys(titles[lang]).map(key => key)
      })
    }
*/

  const Store = ({filter}) => {
    return (
    <div className={classes.defaultBackgroundStyle}>
      <Fab
        className={classes.floatingButton}
        color="primary"
        component={Router.Link}
        to='/'
      >
        <ChevronLeftIcon />
      </Fab>
    </div>
  )}

  const About = () => {
    return (
      <div>
        <Fab
          className={classes.topButton}
          color="primary"
          component={Router.Link}
          to='/'
        >
          <ChevronLeftIcon />
        </Fab>
        <Divider />
        <Typography
          type="title"
          color="inherit"
          className={classes.aboutMainTitle}
        >ConnectBox Media UI Client</Typography>
        <Typography
          type="title"
          className={classes.aboutTitle}
        >{t('swDescription')}</Typography>
        <Typography
          type="title"
          className={classes.aboutTitle}
        >{t('version')+" "+versionStr}</Typography>
      </div>
    )
  }

  const Settings = (props) => {
    const { t, classes, defaultLang } = props
    return (
      <div>
        <Fab
          className={classes.topButton}
          color="primary"
          component={Router.Link}
          to='/'
        >
          <ChevronLeftIcon />
        </Fab>
        <Divider />
        <Typography
          type="title"
          color="inherit"
          className={classes.menuTitle}
        >{t("navLang")}:</Typography>
        <Typography className={classes.smallText}>({lang})</Typography>
        <NavLangSelect
          languages={[defaultLang]}
          onSelectUpdate={(valArr) => console.log(valArr)}
        />
        <Divider />
        <Typography
          type="title"
          color="inherit"
          className={classes.menuTitle}
        >{t("mediaContentLang")}:</Typography>
        <LanguageSelect
          languages={this.props.languages}
          myLang={this.props.myLang}
          onSelectUpdate={this.props.onMyLangUpdate}
        />
        <Divider />
        <FormControlLabel
          className={classes.checkBox}
          control={
            <Checkbox
              checked={showAll}
              onChange={setShowAll(!showAll)}
              value="showAll"
            />
          }
          label="Show additional library content"
        />
      </div>
    )
  }

  const isCurPlaying = (curPlay!=null)
  return (
    <div
      id="page_container"
      data-playing={isCurPlaying}
    >
      <Drawer
        docked="false"
        width={200}
        open={open}
        onClose={handleClose}
      >
        <CboxMenuList
          channel={channel}
          onMenuClick={() => setOpen(false)}
        />
      </Drawer>
      <Router.Switch>
        <Router.Route exact path='/' component={Home}/>
        <PropsRoute path='/audio' component={Store} filter="aud"/>
        <PropsRoute path='/music' component={Store} filter="music"/>
        <PropsRoute path='/books' component={Store} filter="epub"/>
        <PropsRoute path='/pdf' component={Store} filter="pdf"/>
        <PropsRoute path='/training' component={Store} filter="html"/>
        <PropsRoute path='/bible' component={Store} filter="bible"/>
        <PropsRoute path='/download' component={Store} filter="dwnl"/>
        <PropsRoute path='/video' component={Store} filter="vid"/>
        <Router.Route path='/setting' component={Settings}/>
        <Router.Route path='/about' component={About}/>
      </Router.Switch>
    </div>
  )
}

export default CboxApp
