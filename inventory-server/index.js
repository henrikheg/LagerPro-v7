import React from "react";
import ReactDOM from "react-dom/client";

const API = window.__API__;

function Login({ onLogin }) {
  const [username, setU] = React.useState("");
  const [password, setP] = React.useState("");
  const [err, setErr] = React.useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      const r = await fetch(API + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) throw new Error("Feil brukernavn/passord");
      const data = await r.json();
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 300 }}>
      <h2>🔐 Logg inn</h2>
      <input
        placeholder="Brukernavn"
        value={username}
        onChange={(e) => setU(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <input
        type="password"
        placeholder="Passord"
        value={password}
        onChange={(e) => setP(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <button style={{ width: "100%" }}>Logg inn</button>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </form>
  );
}

function Products({ token }) {
  const [list, setList] = React.useState([]);
  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState("");

  async function load() {
    const r = await fetch(API + "/api/products", {
      headers: { Authorization: "Bearer " + token },
    });
    if (r.ok) setList(await r.json());
  }

  async function addProduct(e) {
    e.preventDefault();
    await fetch(API + "/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, qty: Number(qty) }),
    });
    setName("");
    setQty("");
    load();
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>📦 Produkter</h2>
      <form onSubmit={addProduct} style={{ marginBottom: 10 }}>
        <input
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Antall"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: 80, marginLeft: 5 }}
        />
        <button style={{ marginLeft: 5 }}>Legg til</button>
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Navn</th>
            <th>Antall</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>LagerPro v7.3 – Henrik Edition</h1>
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <Products token={token} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
