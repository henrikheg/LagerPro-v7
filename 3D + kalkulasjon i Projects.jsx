import ThreeView from "./ThreeView";

...

{selected && (
  <div>
    <h3>Kalkulator for {selected.name}</h3>
    <ThreeView />
    <form
      onSubmit={async e => {
        e.preventDefault();
        const data = {
          length: parseFloat(e.target.length.value),
          width: parseFloat(e.target.width.value),
          height: parseFloat(e.target.height.value),
          density: parseFloat(e.target.density.value)
        };
        const r = await fetch(API + "/api/calc/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const res = await r.json();
        alert(`Volum: ${res.volume.toFixed(2)} m³, Vekt: ${res.mass.toFixed(2)} kg`);
      }}
    >
      <input name="length" placeholder="Lengde m" />
      <input name="width" placeholder="Bredde m" />
      <input name="height" placeholder="Høyde m" />
      <input name="density" placeholder="Tetthet kg/m³" />
      <button>Beregn</button>
    </form>
  </div>
)}
