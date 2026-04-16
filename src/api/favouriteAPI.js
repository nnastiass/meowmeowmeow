const API_BASE = 'https://localhost:7278/api';

export async function getFavourites() {
    const res = await fetch(`${API_BASE}/favourite`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch favourites');
    }
    
    return await res.json();
}

export async function toggleFavourite(itemId) {
    const res = await fetch(`${API_BASE}/favourite/${itemId}`, {
        method: 'POST',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to add favourite');
    }
    
    return await res.text();
}

export async function removeFavourite(itemId) {
    const res = await fetch(`${API_BASE}/favourite/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to remove favourite');
    }
    
    return await res.text();
}