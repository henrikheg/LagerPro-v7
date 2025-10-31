import React from'react'
import{getProjects,createProject,projectPDF,emailProjectPDF}from'../src/api'
export default function Projects(){
  const[list,setList]=React.useState([]);const[p,setP]=React.useState({name:'',client:'',address:'',status:'Planlagt',budget:''})
  const load=async()=>setList(await getProjects());React.useEffect(()=>{load()},[])
  const add=async()=>{if(!p.name)return;await createProject({...p,budget:p.budget?Number(p.budget):null});setP({name:'',client:'',address:'',status:'Planlagt',budget:''});await load()}
  return(<div className='container'>
    <div className='card'><h3>Opprett prosjekt</h3>
      <div className='row'><input className='input' placeholder='Navn' value={p.name} onChange={e=>setP({...p,name:e.target.value})}/>
      <input className='input' placeholder='Kunde' value={p.client} onChange={e=>setP({...p,client:e.target.value})}/>
      <input className='input' placeholder='Adresse' value={p.address} onChange={e=>setP({...p,address:e.target.value})}/>
      <input className='input' placeholder='Status' value={p.status} onChange={e=>setP({...p,status:e.target.value})}/>
      <input className='input' type='number' step='0.01' placeholder='Budsjett (kr)' value={p.budget} onChange={e=>setP({...p,budget:e.target.value})}/>
      <button className='btn primary' onClick={add}>Opprett</button></div>
    </div>
    <div className='card'><h3>Prosjekter</h3>
      <table className='table'><thead><tr><th>ID</th><th>Navn</th><th>Kunde</th><th>Status</th><th>Budsjett</th><th>Rapport</th></tr></thead><tbody>
      {list.map(pr=>(<tr key={pr.id}><td>{pr.id}</td><td>{pr.name}</td><td>{pr.client||'-'}</td><td>{pr.status}</td><td>{pr.budget??'-'}</td>
      <td><div className='row'><button className='btn' onClick={()=>projectPDF(pr.id)}>PDF</button><button className='btn' onClick={()=>emailProjectPDF(pr.id)}>E-post</button></div></td></tr>))}
      </tbody></table>
    </div>
  </div>)}
