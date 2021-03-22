import React, { useState, useEffect, useRef } from 'react'

const CboxReadOutLoud = (props) => {
  const [location, setLocation] = useState(undefined)
  const iframeRef = useRef()

  useEffect(() => {
    if (props.location != null){
      setLocation(props.location)
    }
  }, [props.location])

//  const onLocationChanged = checkLoc => props.onProgress && props.onProgress(checkLoc)
  const handleLoading = event => console.log(event)

  useEffect(() => {
    let iframeRefCurrent
    if ((props.onProgress != null)&&(iframeRef.current != null)){
      iframeRefCurrent = iframeRef.current
      iframeRefCurrent.addEventListener('load', handleLoading, true)
    }
    return () => iframeRefCurrent.removeEventListener('load', handleLoading)
  }, [props.onProgress,iframeRef])


  const matches = props.url.match(/^(.+\/)(library\/[^/]+)(\/[^/]+){2}$/)
  let rolStr = undefined
  if (matches.length>1) {
    rolStr = matches[1]
  }
  let idStr = undefined
  if (matches.length>2) {
    idStr = matches[2]
  }
  if (location==null) {
    return <div/>
  } else {
//        locationChanged={(loc) => onLocationChanged(loc)}
    return (
      <iframe
        ref={iframeRef}
        src={rolStr+"?epub="+idStr+"&goto=epubcfi("+encodeURI(location)+")"}
        title="Read Out Loud"
        frameBorder="0"
        overflow="hidden"
        width="100%"
        height={props.height}
      />
    )
  }
}

export default CboxReadOutLoud
