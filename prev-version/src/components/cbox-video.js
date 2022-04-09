import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'

const styles = theme => ({
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%'
  },
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

class CboxVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startPos: 0,
      duration: undefined,
    };
  }

  movePos = (newPos) => {
    this.setState({startPos: newPos});
    const durMSec = this.player.getDuration() * 1000;
    if (durMSec>newPos){
      this.player.seekTo(newPos/1000);
    }
  }

  componentDidMount = () => {
    const {playFromPosition} = this.props;
    if ((playFromPosition != null)&&!isNaN(playFromPosition)&&(playFromPosition>0)) {
      this.movePos(playFromPosition);
    }
  }

  componentDidUpdate = (prevProps) => {
    const {playFromPosition} = this.props;
    if ((playFromPosition != null)&&!isNaN(playFromPosition)&&(playFromPosition>0)) {
      if (playFromPosition !== prevProps.playFromPosition) {
        this.movePos(playFromPosition);
      }
    }
  }

  onDuration = (duration) => {
    const newPos = this.state.startPos;
    const durMSec = duration * 1000;
    if (durMSec>newPos){
      this.player.seekTo(newPos/1000);
    }
    if (this.props.onDuration!=null){
      this.props.onDuration(duration)
    }
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { classes, isPaused, url, fullSize } = this.props;
    let { width, height } = this.props;
    const configTest = { file: {
        forceVideo: true
      }}
    if (fullSize) {
      width = '100%';
      height = '100%';
    }
    return (
      <div className={fullSize ? classes.playerWrapper : null}>
        <ReactPlayer
          ref={this.ref}
          className={fullSize ? classes.reactPlayer : null}
          url={url}
          config={configTest}
          onEnded={this.props.onEnded}
          onDuration={this.onDuration}
          onProgress={this.props.onProgress}
          width={width}
          height={height}
          playing={!isPaused}
          controls
        />
      </div>
    )
  }
};

CboxVideoPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CboxVideoPlayer);
