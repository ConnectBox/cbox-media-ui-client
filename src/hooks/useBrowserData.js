import React, { useContext } from 'react'
import { BrowserDataContext } from "../browser-data-context"

const useBrowserData = () => {
  const [state, setState ] = useContext(BrowserDataContext)
  return {...state}
}

export default useBrowserData
