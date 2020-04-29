import React from 'react'
import './App.css'
import CboxAppContainer from './containers/cbox-app-container'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { BrowserDataProvider } from "./browser-data-context"
import { MediaPlayerProvider } from "./media-player-context"
import { LibraryProvider } from "./library-context"
import { SettingsProvider } from "./settings-context"

const App = () => {
  return (
    <I18nextProvider i18n={ i18n }>
      <BrowserDataProvider>
        <MediaPlayerProvider>
          <LibraryProvider>
            <SettingsProvider>
              <CboxAppContainer/>
            </SettingsProvider>
          </LibraryProvider>
        </MediaPlayerProvider>
      </BrowserDataProvider>
    </I18nextProvider>
  )
}

export default App
