const ACCESS_KEY = "jwt_access";
const REFRESH_KEY = "jwt_refresh";

export function saveTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("user_profile");
}
export function isLoggedIn() { return !!getAccessToken(); }