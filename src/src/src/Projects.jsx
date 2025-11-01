import React from "react";
import {
  getProjects,
  addProject,
  getProducts,
  bulkSaveMaterials,
  calcVolume,
  getProjectPDF,
  sendProjectEmail
} from "./api";
import ThreeView from "./ThreeView";

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
    const items = materials.map((m) => ({
      name: m.name,
      qty: 1,
      unit: "stk"
    }));
    await bulkSaveMaterials(token, id, items);
    alert("✅ Materialene ble lagret og trukket fra hovedlageret.");
  }

  async function handleCalc(e) {
    e.preventDefault();
    const data = {
      length: parseFloat(e.target.length.value),
      width: parseFloat(e.target.width.value),
      height: parseFloat(e.target.height.value),
      density: parseFloat(e.target.density.value)
    };
    const r = await calcVolume(data);
    alert(`Volum: ${r.volume.toFixed(2)} m³, Vekt: ${r.mass.toFixed(2)} kg`);
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
          <ThreeView />
          <form onSubmit={handleCalc} style={{ marginTop: 10 }}>
            <input name="length" placeholder="Lengde (m)" />
            <input name="width" placeholder="Bredde (m)" />
            <input name="height" placeholder="Høyde (m)" />
            <input name="density" placeholder="Tetthet (kg/m³)" />
            <button>Beregn</button>
          </form>

          <button onClick={() => saveToProject(selected.id)} style={{ marginTop: 10 }}>
            💾 Lagre materialer
          </button>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => getProjectPDF(token, selected.id)}
              style={{ marginRight: 10 }}
            >
              📄 Last ned PDF
            </button>
            <button
              onClick={async () => {
                try {
                  await sendProjectEmail(token, selected.id);
                  alert("✅ E-post sendt!");
                } catch {
                  alert("❌ Kunne ikke sende e-post");
                }
              }}
            >
              ✉️ Send e-post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
