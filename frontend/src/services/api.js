const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export { API_BASE_URL };

export function getToken() {
  return localStorage.getItem("sandboxpay_token") || "";
}

export function setToken(token) {
  localStorage.setItem("sandboxpay_token", token);
}

export function removeToken() {
  localStorage.removeItem("sandboxpay_token");
}

export function getSecretApiKey() {
  return localStorage.getItem("sandboxpay_secret_api_key") || "";
}

export function setSecretApiKey(key) {
  localStorage.setItem("sandboxpay_secret_api_key", key);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}