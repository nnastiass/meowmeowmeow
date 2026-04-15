const API_BASE = 'https://localhost:7278/api';

export async function getCategories() {
    const res = await fetch(`${API_BASE}/category`, {
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await res.json();
}

export async function createCategory(categoryData) {
    const res = await fetch(`${API_BASE}/category`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
        throw new Error('Failed to create category');
    }
    return await res.json();
}

export async function deleteCategory(id) {
    const res = await fetch(`${API_BASE}/category/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Failed to delete category');
    }
    return await res.text();
}
