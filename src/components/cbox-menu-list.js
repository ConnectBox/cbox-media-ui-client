import React from 'react'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { isEmptyObj } from '../utils/obj-functions'
import Divider from '@material-ui/core/Divider'
import ActionHome from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import ActionBook from '@material-ui/icons/Book'
import AvPlayArrow from '@material-ui/icons/PlayArrow'
import HeadsetIcon from '@material-ui/icons/Headset'
import SocialSchool from '@material-ui/icons/School'
import InfoIcon from '@material-ui/icons/Info'
import { Group } from 'mdi-material-ui'
import { Download } from 'mdi-material-ui'
// import ImageMusicNote from '@material-ui/icons/MusicNote'
import { withTranslation } from 'react-i18next'


export const menuList = {
  aud: {
    path: "/audio",
    icon: (<HeadsetIcon/>),
    color: "darkblue",
    bkgrd: "#00008b80",
  },
  vid: {
    path: "/video",
    icon: (<AvPlayArrow/>),
    color: "orange",
    bkgrd: "#62632680",
  },
  bible: {
    path: "/bible",
    icon: (<ActionBook/>),
    color: "black",
    bkgrd: "#00000080",
  },
  html: {
    path: "/training",
    icon: (<SocialSchool/>),
    color: "purple",
    bkgrd: "#80008080",
  },
  epub: {
    path: "/books",
    icon: (<ActionBook/>),
    color: "#118511",
    bkgrd: "#11851180",
  },
  pdf: {
    path: "/pdf",
    icon: (<ActionBook/>),
    color: "#dc2e2e",
    bkgrd: "#dc2e2eb3",
  },
  dwnl: {
    path: "/download",
    icon: (<Download/>),
    color: "darkgoldenrod",
    bkgrd: "#b8860b80",
  },
/*
  page: {
    path: "/pages",
    icon: (<Group/>),
    color: "cadetblue",
    bkgrd: "#5f9ea080",
  },
  music: {
    path: "/music",
    icon: (<ImageMusicNote/>),
    color: "red",
    bkgrd: "#ff000080",
  },
*/
}

const linkStyle =  {
  color: "black",
  textDecoration: 'none'
}

const CboxMenuList = props => {
  const {channel,t,hideIcons,onMenuClick} = props
  let tmpTitle = ""
  if (!isEmptyObj(channel)) {
    tmpTitle = channel.title
  }
  return (
    <div>
      <List>
        <Link key={"home"} to={"/"} style={linkStyle}>
          <ListItem button onClick={(e) => onMenuClick(null)}>
            <ListItemIcon style={{color: "green"}}>
              {!hideIcons && <ActionHome/>}
            </ListItemIcon>
            <ListItemText primary={tmpTitle}/>
          </ListItem>
        </Link>
        {Object.keys(menuList).map((key,index) => {
          const item = menuList[key]
          const {path, icon, color} = item
          return (
            <Link key={index} to={path} style={linkStyle}>
              <ListItem button onClick={(e) => onMenuClick(item)}>
                <ListItemIcon style={{color}}>
                  {!hideIcons && icon}
                </ListItemIcon>
                <ListItemText primary={t(key,{count: 100})}/>
              </ListItem>
            </Link>
          )
        })}
      </List>
      <Divider />
      <List>
        <Link to={"/setting"} style={linkStyle}>
          <ListItem button onClick={(e) => onMenuClick(null)}>
            <ListItemIcon>
              <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary={t("settings")}/>
          </ListItem>
        </Link>
      </List>
      <List>
        <Link to={"/about"} style={linkStyle}>
          <ListItem button onClick={(e) => onMenuClick(null)}>
            <ListItemIcon>
              <InfoIcon/>
            </ListItemIcon>
            <ListItemText primary={t("about")}/>
          </ListItem>
        </Link>
      </List>
    </div>
  )
}

export default withTranslation()(CboxMenuList)
