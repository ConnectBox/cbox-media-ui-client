import { useContext } from 'react'
import { MediaPlayerContext } from "../media-player-context"

const useMediaPlayer = () => {
  const [state, setState, handlerFunctions ] = useContext(MediaPlayerContext)
  return {
     ...state,
     ...handlerFunctions
   }
}

export default useMediaPlayer
