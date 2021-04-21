import React from "react"
import LazyLoad from 'react-lazyload'
import { getImgOfObj } from '../utils/obj-functions'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  imageRoot: {
    height: props => props.height,
    width: props => props.width,
    marginTop: props => props.marginTop,
    float: props => props.float,
  },
  filler: {
    height: '100%',
    width: '100%',
  },
}))

const ItemImage = (props) => {
  const {item,curEp,onClick} = props
  const classes = useStyles(props)
  let useImage = getImgOfObj(item)
  if (curEp && curEp.image) useImage = getImgOfObj(curEp)
  return (
    <LazyLoad height={props.height}>
      <div
        onClick={(ev) => onClick(ev)}
        style={(true) ? {cursor: "default"} : null}
      >
        <img
          className={classes.imageRoot}
          src={useImage}
          alt={item.title}
        />
        <div className={classes.filler}/>
      </div>
    </LazyLoad>
  )
}

export default ItemImage
