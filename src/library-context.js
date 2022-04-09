import React, { useState } from 'react'

const LibraryContext = React.createContext([{}, () => {}])
const LibraryProvider = ({children}) => {
  const [state, setState] = useState({})
  return (
    <LibraryContext.Provider value={[state, setState]}>
      {children}
    </LibraryContext.Provider>
  )
}
export {LibraryContext, LibraryProvider}
