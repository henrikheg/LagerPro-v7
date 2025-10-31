import React from'react'
import{exportDB,importDB}from'../src/api'
export default function Reports(){
  const onImport=async e=>{const f=e.target.files[0];if(!f)return;await importDB(f);alert('Importert.');e.target.value=''}
  return(<div className='container'><div className='card'><h3>Rapporter & Backup</h3>
  <div className='row'><button className='btn' onClick={exportDB}>Eksporter database</button>
  <label className='btn'><input type='file' accept='.db' onChange={onImport} style={{display:'none'}}/>Importer database</label></div>
  </div></div>)}
