export const API = window.__API__;

// brukerautentisering
export async function login(username, password) {
  const r = await fetch(API + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!r.ok) throw new Error("Feil brukernavn/passord");
  return r.json();
}

// produkter
export async function getProducts(token) {
  const r = await fetch(API + "/api/products", {
    headers: { Authorization: "Bearer " + token }
  });
  return r.json();
}

export async function addProduct(token, item) {
  await fetch(API + "/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(item)
  });
}

// prosjekter og kalkulasjon
export async function getProjects(token) {
  const r = await fetch(API + "/api/projects", {
    headers: { Authorization: "Bearer " + token }
  });
  return r.json();
}

export async function addProject(token, proj) {
  const r = await fetch(API + "/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(proj)
  });
  return r.json();
}

export async function bulkSaveMaterials(token, projectId, items) {
  await fetch(API + `/api/projects/${projectId}/materials/bulk_save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ items })
  });
}

export async function calcVolume(data) {
  const r = await fetch(API + "/api/calc/materials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return r.json();
}
