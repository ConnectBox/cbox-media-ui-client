import { useState, useContext } from 'react'
import { LibraryContext } from "../library-context"

/*
onTitlesUpdate={this.props.onTitlesUpdate}
onAddTitle={this.props.onAddTitle}
onDeleteTitle={this.props.onDeleteTitle}
onLanguageUpdate
onsetCurView={this.props.onsetCurView}
*/

const useLibrary = () => {
  const [state, setState] = useContext(LibraryContext)
//  const {curLang,param,locPath} = state
  const setCurView = (curView) => {
console.log(curView)
    setState(state => ({ ...state, curView }))
  }

  return {
    setCurView,
    ...state
  }
}

export default useLibrary
