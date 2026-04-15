const API_BASE = 'https://localhost:7278/api';

export async function getFavourites() {
    console.log("=== DEBUG: Fetching Favourites ===");
    
    const res = await fetch(`${API_BASE}/favourite`, {
        method: 'GET',
        credentials: 'include', // Double-checking this is here!
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log("DEBUG Response Status:", res.status);
    
    if (!res.ok) {
        console.error("DEBUG Error fetching! Status was:", res.status);
        throw new Error('Failed to fetch favourites');
    }
    
    const data = await res.json();
    console.log("DEBUG Data received:", data);
    return data;
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

// ... existing getFavourites and toggleFavourite ...

export async function removeFavourite(itemId) {
    // Notice it points to the new /remove/ route we just made in C#
    const res = await fetch(`${API_BASE}/favourite/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to remove favourite');
    }
    
    return await res.text();
}
