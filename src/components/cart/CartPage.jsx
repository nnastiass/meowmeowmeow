import { useEffect, useState } from 'react';
import { getCart, removeFromCart as removeFromCartAPI } from '../../api/cartAPI';

export default function CartPage({ currentUser }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            setCartItems([]);
            return;
        }

        const updateCart = async () => {
            try {
                const cart = await getCart();
                if (Array.isArray(cart)) {
                    setCartItems(cart);
                } else {
                    setCartItems([]);
                }
            } catch (fetchError) {
                console.error(fetchError);
                setCartItems([]);
            }
        };

        updateCart();
    }, [currentUser]);

    const removeFromCart = async (itemId) => {
        if (!currentUser) return;

        try {
            await removeFromCartAPI(itemId);
            setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (fetchError) {
            console.error(fetchError);
        }
    };

    if (!currentUser) {
        return <p>Please log in to view your cart.</p>;
    }

    return (
        <div>
            <h2>My Cart</h2>
            <p>Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 || currentUser.role?.toLowerCase?.() === 'admin' ? 'admin' : 'normal'})</p>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={item.id ?? `${item.title}-${index}`}>
                            <strong>{item.title}</strong> — {item.description}
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                by {item.author} at {new Date(item.createdAt).toLocaleString()}
                            </div>
                            <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
