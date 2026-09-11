const baseUrl = import.meta.env.VITE_API_URL;

export function isHostedApiEnabled() {
  return Boolean(baseUrl);
}

export async function apiRequest(path, options = {}) {
  if (!baseUrl) throw new Error('Hosted API is not configured');
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.status === 204 ? null : response.json();
}
