export const API=(typeof window!=='undefined'&&window.__API__)||'http://localhost:4000'
let TOKEN=null, USER=null
export function setToken(t){TOKEN=t}
export function setUser(u){USER=u}
function H(json=true){const h={}; if(TOKEN)h['Authorization']='Bearer '+TOKEN; if(json)h['Content-Type']='application/json'; return h}
// Auth
export async function login(username,password){const r=await fetch(API+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});if(!r.ok)throw new Error('Feil brukernavn/passord');return r.json()}
// Users
export async function hashAllUsers(){const r=await fetch(API+'/api/users/hash_all',{method:'POST',headers:H()});if(!r.ok)throw new Error('Hash feilet');return r.json()}
// Inventory (read-only for workers; create/update only admin via API)
export async function getLocations(){const r=await fetch(API+'/api/locations',{headers:H(false)});if(!r.ok)throw new Error('Hent lagre feilet');return r.json()}
export async function getProducts(){const r=await fetch(API+'/api/products',{headers:H(false)});if(!r.ok)throw new Error('Hent produkter feilet');return r.json()}
// Projects
export async function getProjects(){const r=await fetch(API+'/api/projects',{headers:H(false)});if(!r.ok)throw new Error('Hent prosjekter feilet');return r.json()}
export async function createProject(p){const r=await fetch(API+'/api/projects',{method:'POST',headers:H(),body:JSON.stringify(p)});if(!r.ok)throw new Error('Opprette prosjekt feilet');return r.json()}
export async function bulkSaveMaterials(projectId,items){const r=await fetch(API+`/api/projects/${projectId}/materials/bulk_save`,{method:'POST',headers:H(),body:JSON.stringify({items})});if(!r.ok)throw new Error('Lagring feilet');return r.json()}
export function projectPDF(id){window.location=API+`/api/projects/${id}/report/pdf`}
export async function emailProjectPDF(id){const r=await fetch(API+`/api/projects/${id}/report/email`,{method:'POST',headers:H()});if(!r.ok)throw new Error('E-post feilet');return r.json()}
// DB
export function exportDB(){window.location=API+'/api/db/export'}
export async function importDB(file){const fd=new FormData();fd.append('file',file);const r=await fetch(API+'/api/db/import',{method:'POST',headers:{Authorization:H(false).Authorization},body:fd});if(!r.ok)throw new Error('Import feilet');return r.json()}
