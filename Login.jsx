import React,{useState}from'react'
import{login,setToken,setUser}from'../src/api'
export default function Login(){
  const[u,setU]=useState('admin'),[p,setP]=useState('lagerpro123'),[msg,setMsg]=useState('')
  const go=async e=>{e.preventDefault();try{const r=await login(u,p);setToken(r.token);setUser(r.user);setMsg('Innlogget som '+r.user.username+' ('+r.user.role+')')}catch(e){setMsg(e.message)}}
  return(<div className='container'><div className='card'><h3>Logg inn</h3>
  <form onSubmit={go} className='row'><input className='input' value={u} onChange={e=>setU(e.target.value)} placeholder='Brukernavn'/><input className='input' value={p} onChange={e=>setP(e.target.value)} type='password' placeholder='Passord'/><button className='btn primary'>Logg inn</button></form>
  <p className='small'>{msg}</p></div></div>)}
