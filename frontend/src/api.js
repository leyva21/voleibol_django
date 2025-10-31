const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function listVoleibol() {
  const res = await fetch(`${API_BASE}/api/voleibol/`);
  return res.json();
}

export async function createVoleibol(team_name, coach_name, founded_year, championships_won) {
  const res = await fetch(`${API_BASE}/api/voleibol/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team_name, coach_name, founded_year, championships_won }),
  });
  return res.json();
}

export async function toggleVoleibol(id, done) {
  const res = await fetch(`${API_BASE}/api/voleibol/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  });
  return res.json();
}
