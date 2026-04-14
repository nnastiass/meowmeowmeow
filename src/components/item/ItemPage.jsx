import { useEffect, useState } from 'react';
import ItemForm from './itemForm';

const STORAGE_KEY = 'itemList';

export default function ItemPage({ currentUser }) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === STORAGE_KEY) {
                setItems(event.newValue ? JSON.parse(event.newValue) : []);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const saveItems = (nextItems) => {
        setItems(nextItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    };

    const handleCreateItem = (itemData) => {
        if (!currentUser || currentUser.role !== 2) {
            setError('Only admin users can create items.');
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            title: itemData.title,
            description: itemData.description,
            author: currentUser.name || currentUser.email || 'admin',
            createdAt: new Date().toISOString(),
        };

        setError(null);
        saveItems([...items, newItem]);
    };

    return (
        <div>
            <h2>Items</h2>
            {currentUser ? (
                <p>
                    Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 ? 'admin' : 'normal'})
                </p>
            ) : (
                <p>Please log in to see item creation controls.</p>
            )}

            {currentUser?.role === 2 ? (
                <div>
                    <h3>Create Item</h3>
                    <ItemForm onCreate={handleCreateItem} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <p style={{ color: currentUser ? 'black' : 'gray' }}>
                    {currentUser ? 'Only admins can create new items.' : 'Log in as an admin to create items.'}
                </p>
            )}

            <h3>Item List</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={item.id ?? `${item.title}-${index}`}>
                        <strong>{item.title}</strong> — {item.description}
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>
                            by {item.author} at {new Date(item.createdAt).toLocaleString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
