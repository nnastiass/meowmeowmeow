const API_BASE = 'https://localhost:7278/api/favourite';

export async function getFavourites() {
    const res = await fetch(API_BASE, { credentials: 'include' });
    return await res.json();
}

export async function toggleFavourite(itemId) {
    const res = await fetch(`${API_BASE}/toggle/${itemId}`, {
        method: 'POST',
        credentials: 'include'
    });
    return await res.json();
}