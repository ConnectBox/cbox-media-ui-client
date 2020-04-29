import React, { useState, useEffect } from 'react'

const CboxTrainingPlayer = (props) => {
  const [location, setLocation] = useState(undefined)

  useEffect(() => {
    if (props.location != null){
      setLocation(props.location)
    }
  }, [props.location])

  const onLocationChanged = checkLoc => props.onProgress && props.onProgress(checkLoc)

  if (props.url==null) {
    return <div/>
  } else {
    return (
      <iframe
        title="Training"
        src={props.url}
        frameBorder="0"
        overflow="hidden"
        width="100%"
        height={props.height}
      />
    )
  }
}

export default CboxTrainingPlayer
