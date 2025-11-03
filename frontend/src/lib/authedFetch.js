import { getAccessToken } from "./auth";

export async function authedFetch(url, options = {}) {
    const token = getAccessToken();
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
}
