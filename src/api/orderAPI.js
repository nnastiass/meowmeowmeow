const API_BASE = 'https://localhost:7278/api/order';

export async function getOrders() {
    const res = await fetch(API_BASE, { credentials: 'include' });
    return await res.json();
}

export async function placeOrder() {
    const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        credentials: 'include'
    });
    return await res.json();
}