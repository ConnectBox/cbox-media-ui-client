import React, { useContext } from 'react'
import { SettingsContext } from "../settings-context"

const useSettings = (props) => {
  const [state, setState, handlerFunctions ] = useContext(SettingsContext)
  return {
     ...state,
     titles: state.titleList,
     languages: state.langList,
     ...handlerFunctions
   }
}

export default useSettings
