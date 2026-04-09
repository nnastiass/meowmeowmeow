const API_BASE = 'https://localhost:7278/api/item';

export async function getItems() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch items');
    return await res.json();
}

export async function postItem(itemData) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),

        credentials: 'include', 
    });

    if (!res.ok) {

        throw new Error(`Error ${res.status}: Failed to create item`);
    }
    return await res.json();
}

export async function updateItem(id, itemData) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Update failed');
    }
    return await res.json();
}

export async function deleteItem(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete item');
    }
    return await res.json();
}