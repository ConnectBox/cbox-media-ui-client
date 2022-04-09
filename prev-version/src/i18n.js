import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import locale2 from 'locale2'

i18n
//  .use(XHR)
// and check https://github.com/i18next/i18next-browser-languageDetector for client side !!!
// and this https://github.com/i18next/i18next-browser-languageDetector/issues/150
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    lng: locale2.substr(0,2),
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
      noUSB: 'No connected USB drive detected',
    },

    resources: {
      en: {
        translation: {
          continue: 'continue',
          cancel: 'cancel',
          save: 'save',
          ok: 'OK',
          myChannel: "My Channel",
          audio: "Audio",
          book: "Book",
          book_plural: "Books",
          training: "Training",
          page: "Page",
          page_plural: "Pages",
          test: "Test",
          bible: "Bible",
          video: "Video",
          settings: "Settings",
          about: "About",
          language: "Language",
          swDescription: "ConnectBox Media UI",
          navLang: "Navigation language",
          mediaContentLang: "Media content languages",
          featured: "Featured",
          myList: "My List",
          title: "Title",
          mainTitle: "Main title",
          description: "Description",
          descr: "Short description",
          id: 'ID',
          episode: "Episode",
          episode_plural: "Episodes",
        },
      },
      de: {
        translation: {
          continue: 'fortsetzen',
          cancel: 'abbrechen',
          save: 'speichern',
          ok: 'OK',
          myChannel: "Mein Medienkanal",
          audio: "Audio",
          book: "Buch",
          book_plural: "Bücher",
          training: "Training",
          page: "Seite",
          page_plural: "Seiten",
          test: "Test",
          bible: "Bibel",
          video: "Video",
          settings: "Einstellungen",
          about: "Info",
          language: "Sprache",
          swDescription: "ConnectBox Medien Navigation",
          navLang: "Navigationssprache",
          mediaContentLang: "Sprachen der Medieninhalte",
          featured: "Ausgewählte Medieninhalte",
          myList: "Meine Liste",
          title: "Titel",
          mainTitle: "Haupttitel",
          description: "Beschreibung",
          descr: "Kurzbeschreibung",
          id: 'ID',
          episode: "Folge",
          episode_plural: "Folgen",
        },
      },
    },
  });

export default i18n;
