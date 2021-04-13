import React, { useState,useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import * as Router from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab'
import ItemList  from './item-list'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { useTranslation } from 'react-i18next'
import CBoxAppBar from './cbox-app-bar'
import CboxMenuList from './cbox-menu-list'
import CboxBibleNavigation from './cbox-bible-navigation'
import { NavLangSelect, LanguageSelect } from './language-select'
import { loadingStateValue } from '../utils/config-data'
import useSettings from '../hooks/useSettings'
import useMediaPlayer from '../hooks/useMediaPlayer'

const defaultBackgroundStyle = {
  height: 'auto',
  minHeight: '100%',
  background: 'black'
}

// const versionStr = 'Version 2.20'

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

const CboxApp = (props) => {
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
// translation path - for instance: "/location/data.en.properties"
  const { curPlay, startPlay } = useMediaPlayer()
  const settings = useSettings()
  const { loadingState, channel,
          versionStr } = settings
  const { t } = useTranslation()
  const classes = useStyles()
  const handleClose = () => setOpen(false)
  const handleStartPlay = (inx,curSerie,curEp) => {
console.log("handleStartBiblePlay")
    startPlay(inx,curSerie,curEp)
  }

  const handleStartBiblePlay = (curSerie,bookObj,id) => {
    const {bk} = bookObj
    const curEp = {bibleType: true,bk,id}
    startPlay(id,curSerie,curEp)
  }

  const Home = (props) => {
    const [isCurBible,setIsCurBible] = useState(false)
    const [curBiblePlay, setCurBiblePlay] = useState(undefined)
    useEffect(() => {
      if (curPlay!=null) setCurBiblePlay(JSON.parse(JSON.stringify(curPlay)))
      if ((curPlay!=null)&&(curPlay.curSerie!=null)&&(curPlay.curSerie.mediaType!=null)){
        setIsCurBible(curPlay.curSerie.mediaType==="bible")
//        if (isCurBible) curBiblePlay.curEp = undefined
      }
    },[curPlay])
    const handleExitBibleNavigation = () => {
console.log("handleExitBibleNavigation")
      setIsCurBible(false)
//      setIsPaused(false)
    }
    const loading = (loadingState!==loadingStateValue.finishedOk)
    return (
  //    <div style={(curView!=null)? defaultBackgroundStyle : null}>
    <div style={defaultBackgroundStyle}>
      <CBoxAppBar
        displayMenu={true}
        onLeftIconButtonClick={() => setOpen(!open)}
      />
      {isCurBible && (<CboxBibleNavigation
  //      isPaused={isPaused}
        onReset={props.onReset}
        onExitNavigation={handleExitBibleNavigation}
        onStartPlay={handleStartBiblePlay}
      />)}
      {(!loading) && !isCurBible && (<ItemList
        filter=''
        onReset={props.onReset}
        curPlay={isCurBible ? curBiblePlay : curPlay}
      />)}
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

//  const isCurPlaying = (curPlay!=null)
//  data-playing={isCurPlaying}
  return (
    <div
      id="page_container"
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
        <Router.Route path='/setting' component={Settings}/>
        <Router.Route path='/about' component={About}/>
      </Router.Switch>
    </div>
  )
}

export default CboxApp
