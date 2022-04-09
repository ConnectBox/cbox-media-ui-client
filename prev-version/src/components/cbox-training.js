import React from 'react';

class CboxTrainingPlayer extends React.Component {
  state = {
    location: undefined,
    curResources: [],
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
    const {url,height} = this.props;
    const {location} = this.state;
    if (location==null) {
      return (
        <iframe
          title="Training"
          src={url}
          frameBorder="0"
          overflow="hidden"
          width="100%"
          height={height}
        />
      )
    }
  }
};

export default CboxTrainingPlayer;
