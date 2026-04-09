const API_BASE = 'https://localhost:7278/api/user';



export async function login(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', 
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed, bro');
    }
    return await res.json();
}

export async function postUser(userData) {
    const res = await fetch(`${API_BASE}/register`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create user');
    }
    return await res.json();
}

export async function getUsers() {
    const res = await fetch(API_BASE, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },

        credentials: 'include' 
    });

    if (!res.ok) {
        console.error(`API Error: ${res.status}`);
        throw new Error(`Failed to fetch users: ${res.status}`);
    }
    return await res.json();
}

export async function getUser(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch user with id ${id}`);
    }
    return await res.json();
}

export async function deleteUser(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        credentials: 'include', 
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete');
    }
    return await res.json();
}