import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Footer from './footer'
import CBoxAppBar from '../components/cbox-app-bar';
import CboxMenuList from '../components/cbox-menu-list';
import { NavLangSelect, LanguageSelect } from '../components/language-select';
import Typography from '@material-ui/core/Typography';
import { Switch, Route, Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import NavChevronLeft from '@material-ui/icons/ChevronLeft';
import MyTitlesList from '../components/my-titles-list.js';
import MediaStore from '../components/media-store.js';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withNamespaces } from 'react-i18next';
import verge from 'verge';

const defaultBackgroundStyle = {
  height: 'auto',
  minHeight: '100%',
  background: 'black'
};

const versionStr = 'Version 2.14';

const styles = theme => ({
  menuTitle: {
    margin: '15px 0px 4px 20px',
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
});

const lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class CboxApp extends React.Component {
  state = {
    open: false,
    langOpen: false,
    isPaused: false,
    isWaitingForPlayInfo: false,
    curCheckPos: undefined,
    editMode: false,
    containerWidth: this.calcContainerWidth(),
  }

  calcContainerWidth() {
    let retVal = verge.viewportW();
    return retVal;
  }

  componentDidMount = () => {
    window.addEventListener('resize', () => {
      const containerWidth = this.calcContainerWidth();
      this.setState({containerWidth});
    }, false);
  }

  handleFinishedPlaying = () => {
    this.props.onPlayNext();
  }

  handleStopPlaying = () => {
    this.props.onStartPlay(undefined);
    this.setState({
      isPaused: false,
      curCheckPos: undefined,
      isWaitingForPlayInfo: false
    });
  }

  handleStartPlay = (inx,curSerie,curEp) => {
    this.setState({
      isPaused: false,
      curCheckPos: undefined,
      isWaitingForPlayInfo: true
    });
    this.props.onStartPlay(inx,curSerie,curEp);
  }

  handlePlaying = (cur) => {
    if ((cur!=null) && (cur.position!=null)
      && this.state.isWaitingForPlayInfo){
      if (cur.position!==this.state.curCheckPos){
        this.setState({
          curCheckPos: cur.position,
          isWaitingForPlayInfo: false
        })
      } else {
        this.setState({curCheckPos: cur.position})
      }
    }
    this.props.onPlaying(cur)
  }

  handleSetPaused = (isPaused) => {
    this.setState({isPaused});
  }

  handleReturnToHome = (ev,props) => {
//console.log(props)
    props.history.goBack()
//    this.props.onSelectView(undefined);
  }

  VideoPlayer = (props) => (
    <div style={defaultBackgroundStyle}>
      <Fab
        onClick={(ev) => this.handleReturnToHome(ev,props)}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Fab>
      <MediaStore
        myTitles={this.props.myTitles}
        titles={this.props.titles}
        myLang={this.props.myLang}
        languages={this.props.languages}
        filter='vid'
        fullList
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        isPaused={this.state.isPaused}
        curPlay={this.props.curPlay}
        curPos={this.props.curPos}
        curView={this.props.curView}
      />
    </div>
  )

  Home = (routeProps) => {
    const { channel, myTitles, featuredList, titles,
            myLang, curPlay, curPos, curView, loading } = this.props;
    const largeScreen = (this.state.containerWidth>=768);
    return (
    <div style={(this.props.curView!=null)? defaultBackgroundStyle : null}>
      <CBoxAppBar
        displayMenu={true}
        largeScreen={largeScreen}
        onLeftIconButtonClick={this.handleToggle}
      />
      {(!loading) && (<MyTitlesList
        myTitles={myTitles}
        titles={titles}
        featuredList={featuredList}
        myLang={myLang}
        channel={channel}
        filter=''
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onReset={this.props.onReset}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        isPaused={this.state.isPaused}
        largeScreen={largeScreen}
        curPlay={curPlay}
        curPos={curPos}
        curView={curView}
      />)}
    </div>
  )}

  Audio = (props) => {
    return (
    <div style={defaultBackgroundStyle}>
      <Fab
        onClick={(ev) => this.handleReturnToHome(ev,props)}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Fab>
      <MediaStore
        myTitles={this.props.myTitles}
        titles={this.props.titles}
        myLang={this.props.myLang}
        languages={this.props.languages}
        filter='aud'
        fullList
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        isPaused={this.state.isPaused}
        curPlay={this.props.curPlay}
        curPos={this.props.curPos}
        curView={this.props.curView}
      />
    </div>
  )}

  Music = (props) => (
    <div>
      <Fab
        onClick={(ev) => this.handleReturnToHome(ev,props)}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Fab>
    </div>
  )

  Books = (props) => (
    <div style={defaultBackgroundStyle}>
      <Fab
        onClick={(ev) => this.handleReturnToHome(ev,props)}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <ChevronLeftIcon />
      </Fab>
      <MediaStore
        myTitles={this.props.myTitles}
        titles={this.props.titles}
        myLang={this.props.myLang}
        languages={this.props.languages}
        filter='epub'
        fullList
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        onAddTitle={this.props.onAddTitle}
        onDeleteTitle={this.props.onDeleteTitle}
        isPaused={this.state.isPaused}
        curPlay={this.props.curPlay}
        curPos={this.props.curPos}
        curView={this.props.curView}
      />
    </div>
  )

  Training = (props) => (
    <div style={defaultBackgroundStyle}>
      <Fab
        onClick={(ev) => this.handleReturnToHome(ev,props)}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <ChevronLeftIcon />
      </Fab>
      <MediaStore
        myTitles={this.props.myTitles}
        titles={this.props.titles}
        myLang={this.props.myLang}
        languages={this.props.languages}
        filter='html'
        fullList
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        onAddTitle={this.props.onAddTitle}
        onDeleteTitle={this.props.onDeleteTitle}
        isPaused={this.state.isPaused}
        curPlay={this.props.curPlay}
        curPos={this.props.curPos}
        curView={this.props.curView}
      />
    </div>
  )

  Bible = () => (<div/>)
  About = (props) => {
    const { t, classes } = this.props;
    return (
      <div>
        <Fab
          onClick={(ev) => this.handleReturnToHome(ev,props)}
          className={classes.topButton}
          color="primary"
          component={Link}
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
        >{versionStr}</Typography>
      </div>
    )
  }

  Settings = (props) => {
    const { t, classes, defaultLang } = this.props;
    return (
      <div>
        <Fab
          onClick={(ev) => this.handleReturnToHome(ev,props)}
          className={classes.topButton}
          color="primary"
          component={Link}
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
          onSelectUpdate={this.handleNavLang}
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
      </div>
    )
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});
  handleMenuSelect = () => this.setState({langOpen: true});
  handleLangClose = () => this.setState({langOpen: false});
  handleEditMode = () => {
    this.setState({
      langOpen: false,
      editMode: true,
    });
  }
  handleMenuClick = (item) => {
    this.setState({open: false});
  }

  handleNavLang = (valArr) => {
console.log(valArr)
  }

  render() {
    const { channel } = this.props;
    const isCurPlaying = (this.props.curPlay!=null);
    return (
      <div
        id="page_container"
        data-playing={isCurPlaying}
      >
        <Drawer
          docked="false"
          width={200}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <CboxMenuList
            channel={channel}
            onMenuClick={this.handleMenuClick}
          />
        </Drawer>
        <Switch>
          <Route exact path='/' component={this.Home}/>
          <PropsRoute path='/audio' component={this.Audio} test="test"/>
          <Route path='/music' component={this.Music}/>
          <Route path='/books' component={this.Books}/>
          <Route path='/training' component={this.Training}/>
          <Route path='/bible' component={this.Bible}/>
          <Route path='/video' component={this.VideoPlayer}/>
          <Route path='/setting' component={this.Settings}/>
          <Route path='/about' component={this.About}/>
        </Switch>
        <Footer
          isPaused={this.state.isPaused}
          isWaitingForPlayInfo={this.state.isWaitingForPlayInfo}
          onSetPaused={this.handleSetPaused}
          curPlay={this.props.curPlay}
          curPos={this.props.curPos}
          onPlaying={this.handlePlaying}
          onFinishedPlaying={this.handleFinishedPlaying}
          onStopCallback={this.handleStopPlaying}/>
      </div>
    );
  }
}

CboxApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withNamespaces()(CboxApp));
