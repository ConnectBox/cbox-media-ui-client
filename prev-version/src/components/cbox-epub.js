import React from 'react';
import { ReactReader } from 'react-reader';

class CboxEpubPlayer extends React.Component {
  state = {
    location: undefined,
    curResources: [],
  }

  componentDidMount = () => {
    if (this.props.location != null){
      this.setState({location: this.props.location})
    }
  }

  componentDidUpdate = (nextProps) => {
    if (this.props.location !== nextProps.location){
      this.setState({location: nextProps.location})
    }
  }

  onRendition = obj => {
    if ((obj!=null)
        &&(obj.book!=null)
        &&(obj.book.resources!=null)
        &&(obj.book.resources.resources!=null)){
      this.setState(
        {
          curResources: obj.book.resources.resources
        }
      )
    }
  }

  onLocationChanged = checkLoc => {
    const {curResources} = this.state;
    if ((curResources!=null)&&(curResources.length>0)) {
      const curObj = curResources.find(obj => {
        const pos = obj.href.lastIndexOf(checkLoc);
        return (pos>=0)&&(obj.href.length===pos+checkLoc.length);
      }) // Checking if suitable resource is available
      let location=checkLoc; // use initial checkLoc as default
      if (curObj!=null){ // Found resource - use the full href
        location = curObj.href
      }
      this.setState({location})
    }
  }

  render() {
    const {url} = this.props;
    const {location} = this.state;
    if (location==null) {
      return <div/>
    } else {
      return (
        <ReactReader
          url={url}
          location={this.state.location}
          locationChanged={this.onLocationChanged}
          getRendition={this.onRendition}
//          tocChanged={(toc) => console.log(toc)}
        />
      )
    }
  }
};

export default CboxEpubPlayer;
