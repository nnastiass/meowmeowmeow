const API_BASE = 'https://localhost:7278/api/cart';

export async function getCart() {
    const res = await fetch(API_BASE, { credentials: 'include' });
    if (!res.ok) throw new Error("Could not fetch cart");
    return await res.json();
}

export async function addToCart(item) {
    const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            publicId: item.publicId,
            name: item.name,
            price: item.price,
            quantity: 1
        }),
        credentials: 'include'
    });
    return await res.json();
}