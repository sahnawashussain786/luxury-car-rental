const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function fetchAPI(path, options = {}) {
  const url = `${API_BASE}/api${path}`;
  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');

  const tokens = typeof window !== 'undefined' ? window.__rentalTokens : null;
  if (tokens?.accessToken) {
    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const res = await fetch(url, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }

  return body;
}

export function setTokens(tokens) {
  if (typeof window !== 'undefined') {
    window.__rentalTokens = tokens ?? null;
  }
}

export function clearTokens() {
  if (typeof window !== 'undefined') {
    window.__rentalTokens = null;
  }
}

export const api = {
  health: () => fetchAPI('/health'),

  auth: {
    register: (payload) =>
      fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) =>
      fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => fetchAPI('/auth/me'),
  },

  cars: {
    list: (params) => {
      const search = new URLSearchParams();
      if (params?.available !== undefined) search.set('available', params.available);
      if (params?.category) search.set('category', params.category);
      if (params?.query) search.set('query', params.query);
      const query = search.toString();
      return fetchAPI(`/cars${query ? `?${query}` : ''}`);
    },
    get: (id) => fetchAPI(`/cars/${id}`),
  },

  bookings: {
    list: () => fetchAPI('/bookings'),
    adminList: () => fetchAPI('/bookings/admin'),
    create: (payload) =>
      fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
    updateStatus: (id, status) =>
      fetchAPI(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};

export { api };
