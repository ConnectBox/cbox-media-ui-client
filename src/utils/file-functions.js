import { iso639_3b2 } from '../iso639-3b2'
import locale2 from 'locale2'

export const getLocale = () => iso639_3b2[locale2.substr(0,2)]
export const getLocaleIso639Letter2 = () => locale2.substr(0,2)
export const unixPathSep = "/"
export const getHostPathSep = () => unixPathSep
