const API_BASE = 'https://localhost:7278/api';

export async function getFavourites() {
    const res = await fetch(`${API_BASE}/favourite`, {
        credentials: 'include',
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
        throw new Error('Failed to toggle favourite');
    }
    return await res.text();
}
