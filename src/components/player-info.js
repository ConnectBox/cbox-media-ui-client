import React from 'react';
import IconButton from 'material-ui/IconButton';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

const styles = {
  icon: {
    position: 'relative',
    top: -22,
    left: '88%'
  },
}

export class PlayerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0
    };
  }

  componentWillMount() {
    this.setState({
      containerWidth: this.calcContainerWidth()
    });
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        containerWidth: this.calcContainerWidth()
      });
    }, false);
  }

  calcContainerWidth = () => {
    let retVal = document.body.clientWidth;
    return retVal;
  }

  handleDownload= (ev) => {
    ev.stopPropagation();
    const tmpFName = this.props.downloadName;
    const temporaryDownloadLink = document.createElement("a");
    temporaryDownloadLink.style.display = 'none';
    document.body.appendChild( temporaryDownloadLink );
    temporaryDownloadLink.setAttribute( 'href', this.props.url );
    temporaryDownloadLink.setAttribute( 'download', tmpFName );
    temporaryDownloadLink.click();
    document.body.removeChild( temporaryDownloadLink );
  }

  handleSetPaused = (ev) => {
    ev.stopPropagation();
    if (this.props.onSetPaused!=null) {
      this.props.onSetPaused(!this.props.isPaused);
    }
  }

  clickedClose = (event) => {
    if (this.props.onCloseCallback!=null) {
      this.props.onCloseCallback(event);
    }
  }

  clickedScrubber = (ev) => {
    ev.stopPropagation();
    const footerHeight = 64; // Maybe we will have to calculate this in the future?
    const playBtnWidth = footerHeight;

    var mouseX = ev.clientX-playBtnWidth;
    if(mouseX>0) {
      const width = this.state.containerWidth;// scrubber Width;
      var percent = mouseX *100 / (width-playBtnWidth);
      if (this.props.onMovePosCallback!=null) {
        this.props.onMovePosCallback(percent);
      }
      ev.preventDefault();
    }
  }

  ms(seconds){
    if(isNaN(seconds)){
      return '00:00';
    }
    else{
      var m = Math.floor(seconds / 60);
      var s = Math.floor(seconds % 60);
      return ((m<10?'0':'') + m + ':' + (s<10?'0':'') + s);
    }
  }

  render() {
    const {serie, episode, curSec, curDur, isWaitingForPlayInfo} = this.props;
    let playStateStr = "pause"; // Show pause button while playing
    if (this.props.isPaused || isWaitingForPlayInfo) {
      playStateStr = "play";
    }
    let percent = 0;
    if ((curDur>0) && (curDur>=curSec)) {
      percent = 100*(curSec / curDur);
    }
    let progressStyle = {
      width: percent +"%"
    };
    let curEpTitle="";
    if (serie!=null){
      if ((serie.fileList!=null) && (episode!=null) && (serie.fileList[0]!=null)) {
        if (episode.title!=null){
          curEpTitle = episode.title
        } else {
          curEpTitle = episode.id;
        }
      } else if (serie.fName!=null){
        curEpTitle = serie.description;
      }
    }
    return (
      <div id="playerInfo">
        <div id="playerBox"></div>
        <div id="scrubber" onClick={this.clickedScrubber}>
          <div id="progressBar" style={progressStyle}></div>
          <div id="infotext">
            <div id="time">
              <div id="played">{this.ms(curSec)}</div>/<div id="duration">{this.ms(curDur)}</div>
            </div>
            <div id="programinfo">
              {serie && <div className="ser-title">{serie.title}</div>}
              {serie && <div className="audio-title">{curEpTitle}</div>}
              {episode && <div className="audio-descr"></div>}
              <IconButton
                aria-label="Download"
                style={styles.icon}
              >
                <FileDownloadIcon
                  onClick={(e) => this.handleDownload(e)}
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div id="play-pause" onClick={(e) => this.handleSetPaused(e)}>
          <p
            id={playStateStr}
            className={isWaitingForPlayInfo?"waiting":null}
          ></p>
        </div>
        <a id="closeFooter" className="close" onClick={this.clickedClose}>Close Footer</a>
      </div>
    )
  }
};
/*
ToDO: Implement multiple files download like this:
(first allow the user to select from a full list of all episodes)
var filesForDownload = [];
filesForDownload( { path: "/path/file1.txt", name: "file1.txt" } );
filesForDownload( { path: "/path/file2.jpg", name: "file2.jpg" } );
filesForDownload( { path: "/path/file3.png", name: "file3.png" } );
filesForDownload( { path: "/path/file4.txt", name: "file4.txt" } );

$jq('input.downloadAll').click( function( e )
{
    e.preventDefault();

    var temporaryDownloadLink = document.createElement("a");
    temporaryDownloadLink.style.display = 'none';

    document.body.appendChild( temporaryDownloadLink );

    for( var n = 0; n < filesForDownload.length; n++ )
    {
        var download = filesForDownload[n];
        temporaryDownloadLink.setAttribute( 'href', download.path );
        temporaryDownloadLink.setAttribute( 'download', download.name );

        temporaryDownloadLink.click();
    }

    document.body.removeChild( temporaryDownloadLink );
} );
*/
