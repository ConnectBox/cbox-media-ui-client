import React from 'react';
import Select from 'react-select';
import './language-select.css';
import 'react-select/dist/react-select.css';
import {iso639Langs} from '../iso639-1-full.js'

const styles = {
  select: {
    boxSizing: 'border-box',
  },
  selectWrapper: {
    margin: "0 15px 0 40px",
    width: "60%",
    paddingBottom: 15,
  },
  multiSelectWrapper: {
    margin: "0 15px 0 40px",
    width: "85%",
    paddingBottom: 15,
  },
}

export const NavLangSelect = (props) => {

  const handleChange = (selArr) => {
    if (props.onSelectUpdate!=null) {
      props.onSelectUpdate(selArr)
    }
  }

  const selectedLang = "eng";
  let langData = [];
  Object.keys(iso639Langs).forEach(langKey => {
    langData.push({
      label: iso639Langs[langKey].name + " (" +iso639Langs[langKey].engName +")",
      value: langKey,
    })
  });
  return (
    <div style={styles.selectWrapper}>
        <Select
           style={styles.select}
           disabled={true}
           simpleValue
           onChange={(val) => handleChange(val)}
           options={langData}
           clearable={false}
           value={selectedLang}
         />
    </div>
  )
}

export const LanguageSelect = (props) => {

  const handleChange = (selArr) => {
    if (props.onSelectUpdate!=null) {
      props.onSelectUpdate(selArr)
    }
  }

  const selectedLang = props.myLang;
  let langData = [];
  if (props.languages!=null){
    props.languages.forEach(langKey => {
      langData.push({
        label: iso639Langs[langKey].name + " (" +iso639Langs[langKey].engName +")",
        value: langKey,
      })
    });
  }
  return (
    <div style={styles.multiSelectWrapper}>
        <Select
           style={styles.select}
           autoFocus
           simpleValue
           multi={true}
           onChange={(val) => handleChange(val)}
           options={langData}
           searchable={false}
           clearable={false}
           value={selectedLang}
         />
    </div>
  )
}

export default LanguageSelect;
