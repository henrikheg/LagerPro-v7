import React from'react'
import{hashAllUsers}from'../src/api'
export default function Users(){
  const[res,setRes]=React.useState(null)
  const go=async()=>{const r=await hashAllUsers();setRes(r)}
  return(<div className='container'><div className='card'><h3>Adminverktøy</h3>
  <button className='btn primary' onClick={go}>Hash alle passord (bcrypt)</button>
  {res&&<p className='small'>Hashet brukere: {res.changed}</p>}
  </div></div>)}
