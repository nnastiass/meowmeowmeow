import { useEffect, useState } from 'react';
import { getOrders, getAllOrders } from '../../api/orderAPI';

export default function OrderPage({ currentUser }) {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const isAdmin = currentUser?.role === 2 || currentUser?.role?.toLowerCase?.() === 'admin';

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = isAdmin ? await getAllOrders() : await getOrders();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError('Failed to load orders.');
            }
        };

        fetchOrders();
    }, [currentUser, isAdmin]);

    if (!currentUser) {
        return <p>Please log in to view orders.</p>;
    }

    return (
        <div>
            <h2>{isAdmin ? "All System Orders (Admin View)" : "My Orders"}</h2>
            <p>Logged in as <strong>{currentUser.name}</strong></p>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {orders.length === 0 ? (
                <p>{isAdmin ? "There are no orders in the system yet." : "You haven't placed any orders yet."}</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((order) => (
                        <div key={order.publicId || order.PublicId} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                <strong>Order ID: {order.publicId || order.PublicId}</strong>
                                <span>{new Date(order.orderDate || order.OrderDate).toLocaleDateString()}</span>
                            </div>

                            {isAdmin && (
                                <p style={{ margin: '0 0 0.5rem 0', color: '#0066cc' }}>
                                    <strong>Customer:</strong> {order.userName || order.UserName}
                                </p>
                            )}
                            

                            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
                                {(order.items || order.Items || []).map((item, idx) => (
                                    <li key={item.publicId || item.PublicId || idx}>
                                        {item.itemName || item.ItemName} — {item.quantity || item.Quantity} x ${(item.price || item.Price).toFixed(2)}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Total: ${(order.totalAmount || order.TotalAmount).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}