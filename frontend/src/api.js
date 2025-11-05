import { authedFetch } from "./lib/authedFetch.js";
import { getAccessToken } from "./lib/auth";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function authLogin({ username, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json(); // { access, refresh }
}

// perfil actual (incluye groups/roles)
export async function authMe() {
  const res = await authedFetch(`${API_BASE}/api/auth/me/`);
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
}

export async function createRegistration(formData) {
  const res = await fetch(`${API_BASE}/api/registrations/`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
}

// Listar registros (protegido por JWT/roles)
export async function listRegistrations() {
  const res = await authedFetch(`${API_BASE}/api/registrations/`);
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
}

// Actualizar o borrar registros (protegidos)
export async function updateRegistration(id, payload) {
  const res = await authedFetch(`${API_BASE}/api/registrations/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
}

export async function deleteRegistration(id) {
  const res = await authedFetch(`${API_BASE}/api/registrations/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw await errorFromResponse(res);
  return true;
}

async function errorFromResponse(res) {
  try {
    const data = await res.json();
    if (data?.detail) return new Error(data.detail);
    // DRF por campo
    const firstKey = Object.keys(data || {})[0];
    if (firstKey) {
      const v = data[firstKey];
      return new Error(Array.isArray(v) ? v[0] : String(v));
    }
    return new Error(`HTTP ${res.status}`);
  } catch {
    return new Error(`HTTP ${res.status}`);
  }
}

export async function apiGet(path) {
  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}