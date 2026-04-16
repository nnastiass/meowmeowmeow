const API_BASE = 'https://localhost:7278/api';

export async function getItems() {
    const res = await fetch(`${API_BASE}/item`, {
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch items');
    }
    return await res.json();
}

export async function postItem(itemData) {
    const res = await fetch(`${API_BASE}/item`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
    if (!res.ok) {
        throw new Error('Failed to create item');
    }
    return await res.json();
}

export async function deleteItem(itemId) {
    const res = await fetch(`${API_BASE}/item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to delete item');
    }

    return await res.text(); 
}