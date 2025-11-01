import React from "react";
import ReactDOM from "react-dom/client";
import { login, getProducts, addProduct } from "./api";
import Projects from "./Projects";

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [page, setPage] = React.useState("lager");
  const [products, setProducts] = React.useState([]);
  const [newName, setNewName] = React.useState("");
  const [newQty, setNewQty] = React.useState("");

  async function load() {
    if (token) setProducts(await getProducts(token));
  }

  async function handleLogin(e) {
    e.preventDefault();
    const user = e.target.username.value;
    const pass = e.target.password.value;
    try {
      const d = await login(user, pass);
      localStorage.setItem("token", d.token);
      setToken(d.token);
    } catch (err) {
      alert("Feil innlogging");
    }
  }

  async function addNew(e) {
    e.preventDefault();
    await addProduct(token, { name: newName, qty: Number(newQty) });
    setNewName("");
    setNewQty("");
    load();
  }

  React.useEffect(() => {
    load();
  }, [token]);

  if (!token)
    return (
      <form onSubmit={handleLogin} style={{ padding: 30 }}>
        <h2>🔐 Logg inn</h2>
        <input name="username" placeholder="Brukernavn" />
        <input
          name="password"
          placeholder="Passord"
          type="password"
          style={{ marginLeft: 5 }}
        />
        <button>Logg inn</button>
      </form>
    );

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>LagerPro v7.3 – Henrik Edition</h1>
      <nav style={{ marginBottom: 15 }}>
        <button onClick={() => setPage("lager")}>📦 Lager</button>
        <button onClick={() => setPage("prosjekt")} style={{ marginLeft: 10 }}>
          🧱 Prosjekter
        </button>
      </nav>

      {page === "lager" && (
        <div>
          <form onSubmit={addNew}>
            <input
              placeholder="Produktnavn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Antall"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              style={{ width: 80, marginLeft: 5 }}
            />
            <button style={{ marginLeft: 5 }}>Legg til</button>
          </form>

          <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Navn</th>
                <th>Antall</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {page === "prosjekt" && <Projects token={token} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
