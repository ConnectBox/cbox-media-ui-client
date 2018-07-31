import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

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
  const { classes, channel, displayMenu } = props;
  let tmpTitle = <span style={styles.title}>
                   <img src={process.env.PUBLIC_URL + '/icon/ConnectBox.png'} alt="" style={styles.logo} />
                 </span>;
  if (channel!=null){
    tmpTitle = <span style={styles.title}>{channel.title}</span>;
  }
  return (
  <AppBar
    className={classes.appbar}
  >
    <Toolbar>
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
         {tmpTitle}
      </Typography>
    </Toolbar>
  </AppBar>
  );
}

CBoxAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CBoxAppBar);
