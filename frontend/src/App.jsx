import { useEffect, useState } from "react";
import { listVoleibol, createVoleibol, toggleVoleibol } from "./api";

export default function App() {
  const [todos, setVoleibol] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const data = await listVoleibol();
    setVoleibol(data);
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await createVoleibol(text.trim());
    setText("");
    load();
  }

  async function toggle(t) {
    await toggleVoleibol(t.id, !t.done);
    load();
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Voleibol</h1>
      <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nuevo equipo..."
          style={{ flex: 1, padding: 8 }}
        />
        <button>Agregar</button>
      </form>
      <ul style={{ marginTop: 16, padding: 0, listStyle: "none" }}>
        {todos.map(t => (
          <li key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
