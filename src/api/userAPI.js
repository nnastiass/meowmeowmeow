const API_BASE = 'https://localhost:7278/api';

async function userFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: options.method ?? 'GET',
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
            'Content-Type': options.json === false ? undefined : 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw new Error(data?.message || res.statusText || 'User API request failed');
    }

    return data;
}

export async function getUsers() {
    return userFetch('/user');
}

export async function getUser(id) {
    return userFetch(`/user/${id}`);
}

export async function registerUser(userData) {
    return userFetch('/user/register', { method: 'POST', body: userData });
}

export async function loginUser(email, password) {
    return userFetch('/user/login', { method: 'POST', body: { email, password } });
}

export async function logoutUser() {
    return userFetch('/user/logout', { method: 'POST' });
}

export async function getCurrentUser() {
    return userFetch('/user/me');
}
