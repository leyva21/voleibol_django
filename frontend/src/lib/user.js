import { apiGet } from "../api.js";

export async function fetchProfile() {
  const data = await apiGet("/api/auth/me/");
  localStorage.setItem("user_profile", JSON.stringify(data));
  return data;
}
export function getCachedProfile() {
  const raw = localStorage.getItem("user_profile");
  return raw ? JSON.parse(raw) : null;
}