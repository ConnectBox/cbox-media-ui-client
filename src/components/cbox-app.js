import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Footer from './footer'
import CBoxAppBar from '../components/cbox-app-bar';
import CboxMenuList from '../components/cbox-menu-list';
import { NavLangSelect, LanguageSelect } from '../components/language-select';
import Typography from 'material-ui/Typography';
import { Switch, Route, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import NavChevronLeft from 'material-ui-icons/ChevronLeft';
import MyTitlesList from '../components/my-titles-list.js';
import MediaStore from '../components/media-store.js';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import verge from 'verge';
import 'react-select/dist/react-select.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const defaultBackgroundStyle = {
  height: 'auto',
  minHeight: '100%',
  background: 'black'
};

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
      &&this.state.isWaitingForPlayInfo){
console.log(cur)
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

  handleReturnToHome = () => {
    this.props.onSelectView(undefined);
  }

  VideoPlayer = () => (
    <div style={defaultBackgroundStyle}>
      <Button
        variant="fab"
        onClick={this.handleReturnToHome}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Button>
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

  Home = (props) => {
    const largeScreen = (this.state.containerWidth>=768);
    return (
    <div style={(this.props.curView!=null)? defaultBackgroundStyle : null}>
      <CBoxAppBar
        title={this.state.appTitle}
        onLeftIconButtonClick={this.handleToggle}
        onRightIconMenuSelect={this.handleMenuSelect}
      />
      {(!this.props.loading) && (<MyTitlesList
        myTitles={this.props.myTitles}
        titles={this.props.titles}
        myLang={this.props.myLang}
        filter=''
        onSelectView={this.props.onSelectView}
        onPlayNext={this.props.onPlayNext}
        onStartPlay={this.handleStartPlay}
        onReset={this.props.onReset}
        onSetPaused={this.handleSetPaused}
        onMyTitlesUpdate={this.props.onMyTitlesUpdate}
        isPaused={this.state.isPaused}
        largeScreen={largeScreen}
        curPlay={this.props.curPlay}
        curPos={this.props.curPos}
        curView={this.props.curView}
      />)}
    </div>
  )}

  Audio = (props) => {
    return (
    <div style={defaultBackgroundStyle}>
      <Button
        variant="fab"
        onClick={this.handleReturnToHome}
        className={this.props.classes.floatingButton}
        color="primary"
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Button>
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

  Music = () => (
    <div>
      <Button variant="fab"
        onClick={this.handleReturnToHome}
        secondary={true}
        className={this.props.classes.floatingButton}
        component={Link}
        to='/'
      >
        <NavChevronLeft />
      </Button>
    </div>
  )

  Books = () => (
    <div/>
  )

  Trainng = () => (<div/>)

  Bible = () => (<div/>)

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
console.log(item)
    this.setState({open: false});
  }

  handleNavLang = (valArr) => {
console.log(valArr)
  }

/*
<Divider />
<Typography
  type="title"
  color="inherit"
  className={classes.menuTitle}
>Series Edit Mode:
  <Link to="/" style={{ textDecoration: 'none' }}>
    <Button
      className={classes.configButton}
      onClick={this.handleEditMode}
    >
      <IconModeEdit/>
    </Button>
  </Link>
</Typography>
*/

  render() {
    const largeScreen = (this.state.containerWidth>=768);

    const { classes } = this.props;
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
            onMenuClick={this.handleMenuClick}
          />
        </Drawer>
        <Drawer
          docked="false"
          anchor="right"
          classes={{paper: largeScreen ? classes.drawerPaperLarge : classes.drawerPaperSmall }}
          open={this.state.langOpen}
          onClose={this.handleLangClose}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleLangClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Typography
            type="title"
            color="inherit"
            className={classes.menuTitle}
          >Navigation language:</Typography>
          <Typography className={classes.smallText}>({lang})</Typography>
          <NavLangSelect
            languages={["eng"]}
            onSelectUpdate={this.handleNavLang}
          />
          <Divider />
          <Typography
            type="title"
            color="inherit"
            className={classes.menuTitle}
          >Media content languages:</Typography>
          <LanguageSelect
            languages={this.props.languages}
            myLang={this.props.myLang}
            onSelectUpdate={this.props.onMyLangUpdate}
          />
        </Drawer>
        <Switch>
          <Route exact path='/' component={this.Home}/>
          <PropsRoute path='/audio' component={this.Audio} test="test"/>
          <Route path='/music' component={this.Music}/>
          <Route path='/books' component={this.Books}/>
          <Route path='/training' component={this.Trainng}/>
          <Route path='/bible' component={this.Bible}/>
          <Route path='/video' component={this.VideoPlayer}/>
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

export default withStyles(styles, { withTheme: true })(CboxApp);
