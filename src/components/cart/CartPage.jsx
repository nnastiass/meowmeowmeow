import { useEffect, useState } from 'react';
import { getCart, removeFromCart as removeFromCartAPI } from '../../api/cartAPI';
import { createOrder as createOrderAPI } from '../../api/orderAPI';

const normalizeCartItem = (item) => ({
    id: item.itemPublicId || item.ItemPublicId || item.publicId || item.PublicId || null,
    title: item.itemName || item.ItemName || 'Untitled',
    price: item.itemPrice || item.ItemPrice || 0,
    quantity: item.quantity || item.Quantity || 1,
});

export default function CartPage({ currentUser }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setCartItems([]);
            setCartTotal(0);
            return;
        }

        const updateCart = async () => {
            try {
                const cartData = await getCart();
                
                if (cartData && Array.isArray(cartData.items)) {
                    setCartItems(cartData.items.map(normalizeCartItem));
                    setCartTotal(cartData.total || 0);
                } else {
                    setCartItems([]);
                    setCartTotal(0);
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

    const placeOrder = async () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty. Cannot place an order.');
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            await createOrderAPI();
            setSuccess('Order placed successfully!');
            setCartItems([]);
            setCartTotal(0);
        } catch (orderError) {
            console.error(orderError);
            setError('Failed to place order: ' + orderError.message);
        }
    };

    if (!currentUser) {
        return <p>Please log in to view your cart.</p>;
    }

    return (
        <div>
            <h2>My Cart</h2>
            <p>Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 || currentUser.role?.toLowerCase?.() === 'admin' ? 'admin' : 'normal'})</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={item.id ?? index} style={{ marginBottom: '1rem' }}>
                                <strong>{item.title}</strong> — ${item.price.toFixed(2)}
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                    Quantity: {item.quantity}
                                </div>
                                <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <h3>Total: ${cartTotal.toFixed(2)}</h3>
                    <button onClick={placeOrder} style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginTop: '1rem' }}>
                        Place Order
                    </button>
                </>
            )}
        </div>
    );
}