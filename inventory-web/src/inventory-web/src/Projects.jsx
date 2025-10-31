import React from "react";
import { getProjects, addProject, getProducts, bulkSaveMaterials } from "./api";

export default function Projects({ token }) {
  const [projects, setProjects] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [name, setName] = React.useState("");

  async function load() {
    setProjects(await getProjects(token));
    setMaterials(await getProducts(token));
  }

  async function createProject(e) {
    e.preventDefault();
    const p = await addProject(token, { name });
    setName("");
    setProjects([...projects, p]);
  }

  async function saveToProject(id) {
    const items = materials
      .filter((m) => m.qty > 0)
      .map((m) => ({ name: m.name, qty: 1, unit: "stk" }));
    await bulkSaveMaterials(token, id, items);
    alert("✅ Materialene ble lagret og trukket fra hovedlageret.");
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>🧱 Prosjekter</h2>
      <form onSubmit={createProject}>
        <input
          placeholder="Prosjektnavn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>Opprett prosjekt</button>
      </form>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.name}{" "}
            <button onClick={() => setSelected(p)}>Vis / Kalkuler</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Kalkulator for {selected.name}</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Antall</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => saveToProject(selected.id)}>
            💾 Lagre materialer
          </button>
        </div>
      )}
    </div>
  );
}
