import React from 'react';

class CboxReadOutLoud extends React.Component {
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
    const {url,height} = this.props;
    const {location} = this.state;
    const matches = url.match(/^(.+\/)([^/]+)(\/[^/]+){2}$/);
    let rolStr = undefined;
    if (matches.length>1) {
      rolStr = matches[1]
    }
    let idStr = undefined;
    if (matches.length>2) {
      idStr = matches[2]
    }
    if (location==null) {
      return <div/>
    } else {
      return (
        <iframe
          src={rolStr+"?epub="+idStr}
          title="Read Out Loud"
          frameBorder="0"
          overflow="hidden"
          width="100%"
          height={height}
        />
      )
    }
  }
};

export default CboxReadOutLoud;
