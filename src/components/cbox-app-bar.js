import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';
import NavigationArrowDropDown from 'material-ui-icons/ArrowDropDown';
import MenuIcon from 'material-ui-icons/Menu';
import CboxMenuList from './cbox-menu-list';

const styles = {
  appbar: {
    position: 'fixed',
    backgroundColor: 'whitesmoke',
    color: 'rgb(0,152,210)',
  },
  appIconLeft: {
    color: 'rgb(0,152,210)',
  },
  logo: {
    top: 10,
    height: 40,
  },
  title: {
    cursor: 'pointer',
  },
  root: {
    width: '100%',
  },
  filler: {
    flexBasis: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -22,
  },
};

class SettingsMenu extends Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({open: false})
  };

  handleMenuClick = (menuItem) => {
    if (this.props.onRightIconMenuSelect!=null){
      this.props.onRightIconMenuSelect(menuItem)
    }
    this.setState({open: false})
  };

  render() {
    return (
      <div
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
        iconButtonElement={
          <IconButton><NavigationArrowDropDown color='rgb(0,152,210)'/></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <CboxMenuList
          hideIcons={true}
          title={this.props.title}
          menuMode="settings"
          onRequestClose={this.handleClose}
          onMenuClick={this.handleMenuClick}
        />
      </div>
    )
  }
}
SettingsMenu.muiName = 'IconMenu';

const CBoxAppBar = (props) =>  {
  const { classes } = props;
  const tmpTitle = <Link to='/' style={styles.title}><img src={process.env.PUBLIC_URL + '/icon/ConnectBox.png'} alt="" style={styles.logo} /></Link>;
  return (
  <AppBar
    className={classes.appbar}
  >
    <Toolbar>
      <IconButton
        className={classes.menuButton}
        color="primary"
        aria-label="Menu"
        onClick={props.onLeftIconButtonClick}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        type="title"
        color="inherit"
  //        className={styles.flex}
      >
         {tmpTitle}
      </Typography>
      <div className={classes.filler}></div>
      <div>
        <IconButton
          className={classes.flex}
          color='primary'
          aria-label="Menu"
          onClick={props.onRightIconMenuSelect}
        >
          <NavigationArrowDropDown/>
        </IconButton>
      </div>
    </Toolbar>
  </AppBar>
  );
}

CBoxAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CBoxAppBar);
