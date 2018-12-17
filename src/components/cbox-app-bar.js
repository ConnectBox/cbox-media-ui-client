import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
    height: 54,
  },
  logoSmall: {
    paddingTop: 5,
    height: 35,
  },
  toolbar: {
  },
  toolbarSmall: {
    height: 36,
    minHeight: 36,
  },
  title: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 30,
    textDecoration: 'none',
    width: '100%',
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

const CBoxAppBar = (props) =>  {
  const { classes, displayMenu, largeScreen } = props;
  return (
  <AppBar
    className={classes.appbar}
  >
    <Toolbar
      className={largeScreen ? classes.toolBar : classes.toolbarSmall }
    >
      {displayMenu && (<IconButton
        className={classes.menuButton}
        color="primary"
        aria-label="Menu"
        onClick={props.onLeftIconButtonClick}
      >
        <MenuIcon />
      </IconButton>)}
      <Typography
        className={classes.title}
        type="title"
        color="inherit"
  //        className={styles.flex}
      >
        <span style={styles.title}>
          <img
            src={process.env.PUBLIC_URL + '/icon/ConnectBox.png'}
            alt=""
            style={largeScreen ? styles.logo : styles.logoSmall} />
        </span>
      </Typography>
    </Toolbar>
  </AppBar>
  );
}

CBoxAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CBoxAppBar);
