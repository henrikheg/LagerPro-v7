import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from '../views/Login'
import Calculators from '../views/Calculators'
import Projects from '../views/Projects'
import Reports from '../views/Reports'
import Users from '../views/Users'
import './styles.css'
function Nav(){return(<nav className='topbar'><div className='brand'><img src='/public/logo.svg' width='20'/> LagerPro</div><div>
  <Link to='/projects' style={{marginRight:10}}>Prosjekter</Link>
  <Link to='/calc' style={{marginRight:10}}>Kalkulatorer + 3D</Link>
  <Link to='/reports' style={{marginRight:10}}>Rapporter & Backup</Link>
  <Link to='/login'>Logg inn</Link>
</div></div></nav>)}
function Root(){return(<BrowserRouter><Nav/><Routes>
  <Route path='/' element={<Navigate to='/projects'/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/calc' element={<Calculators/>}/>
  <Route path='/projects' element={<Projects/>}/>
  <Route path='/reports' element={<Reports/>}/>
  <Route path='/users' element={<Users/>}/>
</Routes></BrowserRouter>)}
createRoot(document.getElementById('root')).render(<Root/>)