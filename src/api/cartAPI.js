const API_BASE = 'https://localhost:7278/api/cart';

export async function getCart() {
    const res = await fetch(API_BASE, {
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch cart');
    }
    return await res.json();
}

export async function addToCart(itemId) {

    const res = await fetch(`${API_BASE}/add?itemId=${itemId}`, {
        method: 'POST',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to add item to cart');
    }
    return await res.json(); 
}

export async function removeFromCart(itemId) {

    const res = await fetch(`${API_BASE}/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    if (!res.ok) {
        throw new Error('Failed to remove item from cart');
    }
    
    return await res.text();
}
