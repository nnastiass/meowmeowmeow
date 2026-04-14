const API_BASE = 'https://localhost:7278/api/user';

export async function getUsers() {
    const res = await fetch(API_BASE);
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return await res.json();

}

export async function getUser(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch user with id ${id}`);
    }
    return await res.json();}

export async function postUser(userData) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        throw new Error('Failed to create user');
    }
    return await res.json();
}
