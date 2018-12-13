import React from 'react';
import Select from 'react-select';
import './language-select.css';
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
  const handleChange = (selected) => {
    let selArr = [];
    if (selected!=null){
      selected.forEach(obj => {
        selArr.push(obj.value)
      });
    }
    if (props.onSelectUpdate!=null) {
      props.onSelectUpdate(selArr)
    }
  }
  const getValue = (opts, val) => opts.find(o => o.value === val);
  let selectedLang = "eng";
  if ((props.languages!=null)&&(props.languages.length>0)){
    selectedLang = props.languages[0];
  }
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
           isDisabled={true}
           onChange={(val) => handleChange(val)}
           options={langData}
           isClearable={false}
           value={getValue(langData, selectedLang)}
         />
    </div>
  )
}

export const LanguageSelect = (props) => {
  const handleChange = (selected) => {
    let selArr = [];
    if (selected!=null){
      selected.forEach(obj => {
        selArr.push(obj.value)
      });
    }
    if (props.onSelectUpdate!=null) {
      props.onSelectUpdate(selArr)
    }
  }
  const getValues = (opts, values) => opts.filter(o => values.indexOf(o.value)>=0);
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
           isMulti={true}
           isSearchable={false}
           isClearable={false}
           onChange={(val) => handleChange(val)}
           options={langData}
           name="langSelect"
           value={getValues(langData,selectedLang)}
         />
    </div>
  )
}

export default LanguageSelect;
