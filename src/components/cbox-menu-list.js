import React from 'react';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { isEmptyObj } from '../utils/obj-functions';
import Divider from 'material-ui/Divider';
import ActionHome from 'material-ui-icons/Home';
import SettingsIcon from 'material-ui-icons/Settings';
import ActionBook from 'material-ui-icons/Book';
import AvPlayArrow from 'material-ui-icons/PlayArrow';
import SocialSchool from 'material-ui-icons/School';
import ImageMusicNote from 'material-ui-icons/MusicNote';


const menuList = [
  {
    title: "My Channel",
    path: "/",
    icon: (<ActionHome/>),
    color: "green",
    enabled: true,
  },
  {
    title: "Audio",
    path: "/audio",
    icon: (<AvPlayArrow/>),
    color: "darkblue",
    enabled: true,
  },
  {
    title: "Music",
    path: "/music",
    icon: (<ImageMusicNote/>),
    color: "red",
    enabled: false,
  },
  {
    title: "Training",
    path: "/training",
    icon: (<SocialSchool/>),
    color: "purple",
    enabled: false,
  },
  {
    title: "Bible",
    path: "/bible",
    icon: (<ActionBook/>),
    color: "black",
    enabled: false,
  },
  {
    title: "Video",
    path: "/video",
    icon: (<AvPlayArrow/>),
    color: "orange",
    enabled: true,
  },
]

const CboxMenuList = props => {
  return (
    <div>
      <List>
        {menuList.map((item,index) => {
          let btnStyle =  {color: "lightgrey"};
          if (item.enabled){
            btnStyle.color = item.color;
          }
          let tmpTitle = item.title;
          if (!isEmptyObj(props.channel) && (item.path === "/")){
            tmpTitle = props.channel.title;
          }
          let tmpIcon  = item.icon;
          if (props.hideIcons){
            tmpIcon = null
          }
          return (
            <Link key={index} to={item.path} style={{ textDecoration: 'none' }}>
              <ListItem
                button
                onClick={item.enabled? (e) => props.onMenuClick(item) : null}
              >
                <ListItemIcon style={btnStyle}
                >
                  {tmpIcon}
                </ListItemIcon>
                <ListItemText primary={tmpTitle}/>
              </ListItem>
            </Link>
          )
        })}
      </List>
      <Divider />
      <List>
        <Link to={"/setting"} style={{ textDecoration: 'none' }}>
          <ListItem
            button
            onClick={(e) => props.onMenuClick(null)}
          >
            <ListItemIcon>
              <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
    </div>
  )
}

export default CboxMenuList;
