import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import PersonIcon from '@material-ui/icons/Person'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  appbar: {
    position: 'fixed',
    backgroundColor: 'whitesmoke',
    color: 'rgb(0,152,210)',
  },
  appIconLeft: {
    color: 'rgb(0,152,210)',
  },
  profileIcon: {
    height: 32,
    width: 32,
  },
  avatar: {
    height: 32,
    width: 32,
    float: 'left',
  },
  avatarLoggedIn: {
    backgroundColor: 'indianred',
    height: 22,
    width: 22,
    float: 'left',
    marginLeft: 7,
  },
  editIcon: {
  },
  editIconLoggedIn: {
    marginTop: -10,
  },
  logo: {
    marginTop: 10,
    height: 46,
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
  avatarTitle: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 10,
    textDecoration: 'none',
    textAlign:  'center',
  },
  avatarText: {
  },
  title: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 30,
    textDecoration: 'none',
    flexBasis: '100%',
  },
  version: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 16,
    textDecoration: 'none',
    paddingLeft: 34,
  },
  root: {
    width: '100%',
  },
  filler: {
  },
  rightMenuLoggedIn: {
    marginRight: -10,
    width: 40,
    clear: 'both',
  },
  rightMenu: {
    marginTop: -3,
    marginRight: -10,
    width: 40,
    clear: 'both',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -22,
  },
}))

const CBoxAppBar = (props) =>  {
  const { user, mediaEdit, versionStr, largeScreen } = props
  const { t } = useTranslation()
  const classes = useStyles()
  let useVersionStr
  if (versionStr) useVersionStr = t("version") + " " +versionStr
  return (
  <AppBar
    className={classes.appbar}
  >
    <Toolbar
      className={largeScreen ? classes.toolBar : classes.toolbarSmall }
    >
      <Typography
        className={classes.title}
        type="title"
        color="inherit"
      >
        <span className={classes.title}>
          <img
            src={process.env.PUBLIC_URL + '/icon/ConnectBox.png'}
            alt=""
            className={largeScreen ? classes.logo : classes.logoSmall} />
        </span>
      </Typography>
      <div className={classes.filler}></div>
      <div className={user? classes.rightMenuLoggedIn : classes.rightMenu}>
        {user?(
        <div>
          <Avatar
//            alt={user.displayName}
            alt={user}
            src={user.photoURL}
            className={classes.avatarLoggedIn}
            onClick={props.onRightIconMenuSelect}
          />
          <Typography
            className={classes.avatarTitle}
            type="title"
            color="inherit"
          >
            <span className={classes.avatarText}>{user}</span>
        </Typography>
        </div>
        ):(
          <IconButton
            color='primary'
            aria-label="Login Menu"
            className={classes.profileIcon}
            onClick={props.onRightIconMenuSelect}
          >
            <PersonIcon/>
          </IconButton>
        )}
      </div>
    </Toolbar>
    {versionStr && (<Typography
      className={classes.version}
      type="title"
      color="inherit"
    >{useVersionStr}
    </Typography>)}
  </AppBar>
  )
}

export default CBoxAppBar
