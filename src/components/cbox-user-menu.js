import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import {hasPlatformAuthenticator} from '../utils/webauthn'

const CboxUserMenu = props => {
  const handleLogout = () => props.onMenuClick(null)
  const {user} = props
  if (user){
    return (
      <List>
        <ListItem
          button
          onClick={(e) => handleLogout()}
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem>
      </List>)
  } else {
    return (
      <List>
        <ListItem
          button
          onClick={(e) => props.onMenuClick(e,"Admin")}
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Sign in as Administrator" />
        </ListItem>
        <ListItem
          button
          onClick={(e) => props.onMenuClick(e,"Student")}
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Sign in as a Student" />
        </ListItem>
        <ListItem
          button
          onClick={(e) => props.onMenuClick(e,"QR")}
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Register using QR code" />
        </ListItem>
      {hasPlatformAuthenticator && (<ListItem
          button
          onClick={(e) => props.onMenuClick(e,"Touch")}
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Sign in with fingerprint reader" />
        </ListItem>)}
      </List>
    )
  }
}

export default CboxUserMenu
