const AUTH_BASE = `${import.meta.env.VITE_SERVER_URL}/auth`;

async function request(path, options) {
    const res = await fetch(`${AUTH_BASE}${path}`, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = res.status === 204 ? null : await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}

export function signup(email, password, username) {
    return request('/signup', { method: 'POST', body: JSON.stringify({ email, password, username }) });
}

export function login(email, password) {
    return request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function logout() {
    return request('/logout', { method: 'POST' });
}

export function fetchMe() {
    return request('/me', { method: 'GET' });
}