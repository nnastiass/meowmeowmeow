import { useEffect, useState } from 'react';
import { getOrders, getAllOrders } from '../../api/orderAPI';

const normalizeOrder = (order) => ({
    publicId: order.publicId || order.PublicId || null,
    userPublicId: order.userPublicId || order.UserPublicId || null,
    userName: order.userName || order.UserName || 'Unknown',
    items: Array.isArray(order.items || order.Items) ? order.items || order.Items : [],
    totalAmount: order.totalAmount || order.TotalAmount || 0,
    orderDate: order.orderDate || order.OrderDate || new Date().toISOString(),
    status: order.status || order.Status || 'Pending',
});

export default function OrderPage({ currentUser }) {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            if (!currentUser) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                let ordersData;
                
                // Admin sees all orders, others see only their own
                if (currentUser.role === 2 || currentUser.role?.toLowerCase?.() === 'admin') {
                    ordersData = await getAllOrders();
                } else {
                    ordersData = await getOrders();
                }

                setOrders(Array.isArray(ordersData) ? ordersData.map(normalizeOrder) : []);
                setError(null);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Failed to load orders.');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [currentUser]);

    if (!currentUser) {
        return <p>Please log in to view orders.</p>;
    }

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <div>
            <h2>Orders</h2>
            <p>
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 || currentUser.role?.toLowerCase?.() === 'admin' ? 'admin' : 'customer'})
            </p>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div>
                    {orders.map((order, idx) => (
                        <div key={order.publicId ?? idx} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                            <h3>Order ID: {order.publicId}</h3>
                            <p>
                                <strong>User:</strong> {order.userName}
                            </p>
                            <p>
                                <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
                            </p>
                            <p>
                                <strong>Status:</strong> {order.status}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                            </p>
                            <h4>Items:</h4>
                            {order.items && order.items.length > 0 ? (
                                <ul>
                                    {order.items.map((item, itemIdx) => (
                                        <li key={item.publicId ?? itemIdx}>
                                            <strong>{item.itemName || 'Unknown Item'}</strong> — Qty: {item.quantity || 1}, Price: ${(item.price || 0).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items in this order.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
