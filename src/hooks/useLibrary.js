import { useContext } from 'react'
import { LibraryContext } from "../library-context"

const useLibrary = () => {
  const [state, setState] = useContext(LibraryContext)
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
