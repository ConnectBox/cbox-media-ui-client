import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { Download } from 'mdi-material-ui'

const styles = {
  icon: {
    position: 'relative',
    top: -22,
    left: '88%'
  },
  audio: {
    position: 'absolute',
    left: -1,
  },
  playPause: {
    height: 64,
    padding: 8,
    overflow: 'hidden',
    boxSizing: 'border-box',
    width: 64,
    left: 0,
    position: 'absolute',
    bottom: 0,
    background: '#eaeaea',
    borderTop: '1px solid #dbdbdb',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    background: '#eaeaea',
    borderTop: '1px solid #dbdbdb',
  },
  p: {
    width: 48,
    height: 48,
    margin: 0,
    cursor: 'pointer'
  },
  scrubber: {
    position: 'relative',
    display: 'block',
    height: 64,
    margin: 0,
    overflow: 'hidden',
    background: '#eaeaea',
  },
  infoText: {
    marginLeft: -64,
    width: 'auto',
    clear: 'both',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    height: 64,
    width: 0,
    background: '#b1e0c9',
    zIndex: 1,
    borderRight: '1px solid #efb',
  },
  audioDescr: {
    paddingLeft: 5,
    overflow: 'hidden',
    fontWeight: 100,
    textOverflow: 'ellipsis',
    paddingTop: 2,
    fontSize: 11,
  },
  serTitle: {
    height: 16,
    whiteSpace: 'nowrap',
  },
  audioTitle: {
    paddingTop: 6,
    fontSize: 14,
  },
  programinfo: {
    padding: '2px 10',
    color: '#04244d',
    zIndex: 2,
    position: 'relative',
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsisfooter'
  },
  time: {
    float: 'right',
    position: 'relative',
    lineHeight: 4,
    color: '#04244d',
    zIndex: 2,
    paddingRight: 10,
    width: 110,
    display: 'table-cell',
    textAlign: 'left'
  },
  played: {
    padding: '0px 2px 0px 0',
    color: 'steelblue',
    fontStyle: 'normal',
    display: 'inline'
  },
  duration: {
    padding: '0px 0px 0px 2',
    fontWeight: 'normal',
    display: 'inline'
  },
  playWaiting: {
    background: 'url(../../img/play-waiting.png) no-repeat center top',
    backgroundSize: '48px 96',
  },
  play: {
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'pointer',
    zIndex: 2,
    border: 'none',
    overflow: 'hidden',
    outline: 'none',
    backgroundImage: 'url(../../img/play-pause.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'top',
    backgroundSize: '64px 128px',
    width: 64,
    height: 64,
    textIndent: -9999
  },
  pause: {
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'pointer',
    zIndex: 2,
    border: 'none',
    overflow: 'hidden',
    outline: 'none',
    backgroundImage: 'url(../../img/play-pause.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'bottom',
    backgroundSize: '64px 128px',
    width: 64,
    height: 64,
    textIndent: -9999
//    backgroundSize: '48px 96',
  },
  close: {
    position: 'absolute',
    top: -32,
    right: -6,
    cursor: 'pointer',
    zIndex: 2,
    float: 'right',
    display: 'block',
    border: 'none',
    overflow: 'hidden',
    outline: 'none',
    background: 'url("../../img/close.png") no-repeat center center',
    backgroundSize: '32px 32px',
    width: 62,
    height: 62,
    textIndent: -9999
  }
}

export const PlayerInfo = (props) => {
  const {serie, episode, curSec, curDur, isWaitingForPlayInfo} = props

  const handleDownload = (ev) => {
    ev.stopPropagation()
    const tmpFName = this.props.downloadName
    const temporaryDownloadLink = document.createElement("a")
    temporaryDownloadLink.style.display = 'none'
    document.body.appendChild( temporaryDownloadLink )
    temporaryDownloadLink.setAttribute( 'href', this.props.url )
    temporaryDownloadLink.setAttribute( 'download', tmpFName )
    temporaryDownloadLink.click()
    document.body.removeChild( temporaryDownloadLink )
  }

  const handleNewWindow = (ev) => {
    ev.stopPropagation()
console.log(ev)
  }

  const handleSetPaused = (ev) => {
    ev.stopPropagation()
    if (props.onSetPaused!=null) {
      props.onSetPaused(!props.isPaused)
    }
  }

  const clickedClose = (event) => {
    if (props.onCloseCallback!=null) {
      props.onCloseCallback(event)
    }
  }

  const clickedScrubber = (ev) => {
    ev.stopPropagation()
    const footerHeight = 64 // Maybe we will have to calculate this in the future?
    const playBtnWidth = footerHeight

    const mouseX = ev.clientX-playBtnWidth
    if(mouseX>0) {
      const width = props.containerWidth// scrubber Width
      const percent = mouseX *100 / (width-playBtnWidth)
      if (props.onMovePosCallback!=null) {
        props.onMovePosCallback(percent)
      }
      ev.preventDefault()
    }
  }

  const ms = (seconds) => {
    if(isNaN(seconds)){
      return '00:00'
    } // else
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return (`${(m<10?'0':'') + m  }:${  s<10?'0':''  }${s}`)
  }

  let playStateStr = "pause" // Show pause button while playing
  let hasButton = false
  let allowDownload = false
  let btnText = ""
  let btnUrl = ""
  if (props.isPaused || isWaitingForPlayInfo) {
    playStateStr = "play"
  }
  let percent = 0
  if ((curDur>0) && (curDur>=curSec)) {
    percent = 100*(curSec / curDur)
  }
  if (props.isPaused || isWaitingForPlayInfo) {
    playStateStr = "play"
  }
  const {...progressStyles} = styles.progressBar
  const progressStyle = {...progressStyles}
  progressStyle.width = `${percent }%`
  let curEpTitle=""
  if (serie!=null){
    if ((serie.fileList!=null) && (episode!=null) && (serie.fileList[0]!=null)) {
      if (episode.title!=null){
        curEpTitle = episode.title
      } else {
        curEpTitle = episode.id +1
      }
    } else if (serie.fName!=null){
      curEpTitle = serie.description
    }
    hasButton = (serie.button!=null)
    if (hasButton) {
      btnText = serie.button.label
      btnUrl = serie.button.url
    }
  }
//  const playPauseStr = showPause ? "pause" : "play"
  return (
    <div className="playerInfo">
      <div className="playerBox" />
      <div style={styles.scrubber} onClick={clickedScrubber}>
        <div id="progressBar" style={progressStyle} />
        <div style={styles.infotext}>
          <div style={styles.time}>
            <div style={styles.played}>{ms(curSec)}</div>/<div style={styles.duration}>{ms(curDur)}</div>
          </div>
          <div style={styles.programinfo}>
            {serie && <div style={styles.serTitle}>{serie.title}</div>}
            {serie && <div style={styles.audioTitle}>{curEpTitle}</div>}
            {episode && <div style={styles.audioDescr}/>}
            {!hasButton && allowDownload && (<IconButton
              onClick={(e) => handleDownload(e)}
              aria-label="Download"
              style={styles.icon}
            >
              <Download/>
            </IconButton>)}
            {hasButton && (<Button
              href={btnUrl}
              variant="contained"
              color="secondary"
              style={styles.button}
              onClick={(e) => handleNewWindow(e)}
            >{btnText}
            </Button>)}
          </div>
        </div>
      </div>
      <button
        id="playState"
        className={isWaitingForPlayInfo?"waiting":playStateStr}
        style={props.isPaused?styles.play:styles.pause}
        onClick={(e) => handleSetPaused(e)}
       />
      <button
        id="closeFooter"
        className="close"
        style={styles.close}
        onClick={clickedClose}
      />
    </div>
  )
}
/*
ToDO: Implement multiple files download like this:
(first allow the user to select from a full list of all episodes)
var filesForDownload = []
filesForDownload( { path: "/path/file1.txt", name: "file1.txt" } )
filesForDownload( { path: "/path/file2.jpg", name: "file2.jpg" } )
filesForDownload( { path: "/path/file3.png", name: "file3.png" } )
filesForDownload( { path: "/path/file4.txt", name: "file4.txt" } )

//
// style={showPause ? styles.pause : styles.play}
//        <img src={`../../img/${playPauseStr}.png`}/>
$jq('input.downloadAll').click( function( e )
{
    e.preventDefault()

    var temporaryDownloadLink = document.createElement("a")
    temporaryDownloadLink.style.display = 'none'

    document.body.appendChild( temporaryDownloadLink )

    for( var n = 0 n < filesForDownload.length n++ )
    {
        var download = filesForDownload[n]
        temporaryDownloadLink.setAttribute( 'href', download.path )
        temporaryDownloadLink.setAttribute( 'download', download.name )

        temporaryDownloadLink.click()
    }

    document.body.removeChild( temporaryDownloadLink )
} )
*/
