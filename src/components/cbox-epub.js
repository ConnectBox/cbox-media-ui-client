import React, { useState, useEffect, useRef } from "react"
import { Swipeable } from "react-swipeable"
import { EpubView } from 'react-reader'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import ReadiumNavigator from '@readium/navigator-web'

const useStyles = makeStyles(theme => ({
  container: {
    overflow: "hidden",
    height: "100%"
  },
  readerArea: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    transition: "all .3s ease"
  },
  containerExpanded: {
    transform: "translateX(256px)"
  },
  titleArea: {
    position: "absolute",
    top: 20,
    left: 50,
    right: 50,
    textAlign: "center",
    color: "#999"
  },
  reader: {
    position: "absolute",
    top: 50,
    left: 50,
    bottom: 20,
    right: 50
  },
  swipeWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 200
  },
  prev: {
    left: 1
  },
  next: {
    right: 1
  },
  arrow: {
    outline: "none",
    border: "none",
    background: "none",
    position: "absolute",
    top: "50%",
    marginTop: -32,
    fontSize: 64,
    padding: "0 10px",
    color: "#E2E2E2",
    fontFamily: "arial, sans-serif",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    fontWeight: "normal"
  },
  arrowHover: {
    color: "#777"
  },
  tocBackground: {
    position: "absolute",
    left: 256,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
  tocArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    width: 256,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    background: "#f2f2f2",
    padding: "10px 0"
  },
  tocAreaButton: {
    userSelect: "none",
    appearance: "none",
    background: "none",
    border: "none",
    display: "block",
    fontFamily: "sans-serif",
    width: "100%",
    fontSize: ".9em",
    textAlign: "left",
    padding: ".9em 1em",
    borderBottom: "1px solid #ddd",
    color: "#aaa",
    boxSizing: "border-box",
    outline: "none",
    cursor: "pointer"
  },
  tocButton: {
    background: "none",
    border: "none",
    width: 32,
    height: 32,
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 2,
    outline: "none"
  },
  tocButtonExpaned: {
    background: "#f2f2f2"
  },
  tocButtonBar: {
    position: "absolute",
    width: "60%",
    background: "#ccc",
    height: 2,
    left: "50%",
    margin: "-1px -30%",
    top: "50%",
    transition: "all .5s ease"
  },
  tocButtonBarTop: {
    top: "35%"
  },
  tocButtonBottom: {
    top: "66%"
  },
  loadingView: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    color: "#ccc",
    textAlign: "center",
    margintop: "-.5em"
  }
}))


const TocItem = (props) => {
  const setLocation = () => props.setLocation(props.href)
  const { label, styles } = props
  return (
    <button onClick={setLocation} className={styles}>
      {label}
    </button>
  )
}

export const ReactReader = (props) => {
  const classes = useStyles()
  const {url, title, showToc = true,
        loadingView = <div className={classes.loadingView}>Loading…</div>,
        epubOptions, styles, getRendition, locationChanged, location,
        swipeable, tocChanged } = props
  const readerRef = useRef()
  const [expandedToc, setExpandedToc] = useState(false)
  const [toc, setToc] = useState(undefined)
  const toggleToc = () => setExpandedToc(!expandedToc)
  const next = () => readerRef.current.nextPage()
  const prev = () => readerRef.current.prevPage()
//  useEffect(() => tocChanged && tocChanged(toc), [tocChanged,toc])

  const renderToc = () => {
    return (
      <div>

        <div className={classes.tocArea}>
          <div className={classes.toc}>
            {toc.map((item, i) => (
              <TocItem
                {...item}
                key={i}
                setLocation={setLocation}
                styles={classes.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandedToc && (
          <div className={classes.tocBackground} onClick={toggleToc} />
        )}
      </div>
    )
  }

  const renderTocToggle = () => {
    return (
      <button
        className={classNames(classes.tocButton, expandedToc ? classes.tocButtonExpaned : {})}
        onClick={toggleToc}
      >
        <span
          className={classNames( classes.tocButtonBar, classes.tocButtonBarTop)}
        />
        <span
          className={classNames( classes.tocButtonBar, classes.tocButtonBottom)}
        />
      </button>
    )
  }

  const setLocation = loc => {
    setExpandedToc(false)
    locationChanged && locationChanged(loc)
  }

  return (
    <div className={classes.container}>
      <div
        className={classNames(classes.readerArea, expandedToc ? classes.containerExpanded : {})}
      >
        {showToc && renderTocToggle()}
        <div className={classes.titleArea}>{title}</div>
        <Swipeable
          onSwipedRight={prev}
          onSwipedLeft={next}
          trackMouse
        >
          <div className={classes.reader}>
            <EpubView
              ref={readerRef}
              url={url}
              location={location}
              loadingView={loadingView}
              tocChanged={(toc) => setToc(toc)}
              locationChanged={(loc) => setLocation(loc)}
              epubOptions={epubOptions}
              getRendition={getRendition}
            />
            {swipeable && <div className={classes.swipeWrapper} />}
          </div>
        </Swipeable>
        <button
          className={classNames( classes.arrow, classes.prev)}
          onClick={prev}
        >
          ‹
        </button>
        <button
          className={classNames( classes.arrow, classes.next)}
          onClick={next}
        >
          ›
        </button>
      </div>
      {showToc && toc && renderToc()}
    </div>
  )
}

const CboxEpubPlayer = (props) => {
  const [location, setLocation] = useState(undefined)
  const [curResources, setCurResources] = useState([])

  useEffect(() => {
    if (props.location != null){
      setLocation(props.location)
    }
  }, [props.location])

  const onRendition = obj => {
    if ((obj!=null)
        &&(obj.book!=null)
        &&(obj.book.resources!=null)
        &&(obj.book.resources.resources!=null)){
      setCurResources(obj.book.resources.resources)
    }
  }

  const onLocationChanged = checkLoc => props.onProgress && props.onProgress(checkLoc)

  if (location==null) {
    return <div/>
  } else {
    return (
      <ReactReader
        url={props.url}
        location={location}
        locationChanged={(loc) => onLocationChanged(loc)}
        getRendition={onRendition}
        swipeable
//          tocChanged={(toc) => console.log(toc)}
      />
    )
  }
}

export default CboxEpubPlayer
