const API_BASE = 'https://localhost:7278/api/order';

export async function getOrders() {
    const res = await fetch(API_BASE, {
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }
    return await res.json();
}

export async function getAllOrders() {
    const res = await fetch(`${API_BASE}/all`, {
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch all orders');
    }
    return await res.json();
}

export async function createOrder() {
    const res = await fetch(API_BASE, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to create order');
    }
    return await res.json();
}
