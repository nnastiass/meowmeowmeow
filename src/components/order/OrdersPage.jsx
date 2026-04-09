import { useEffect, useState } from "react";
import { getOrders } from "../../api/orderAPI";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders()
            .then(data => {
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Order data is not an array:", data);
                    setOrders([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch orders:", err);
                setOrders([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ color: '#ff0000', textAlign: 'center', fontWeight: 'bold', marginTop: '50px', textTransform: 'uppercase' }}>Loading your history...</p>;

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '4px',
                color: '#000',
                marginBottom: '40px',
                borderBottom: '5px solid #ff0000',
                paddingBottom: '10px'
            }}>
                Your Order History
            </h2>
            
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div key={order.publicId || index} style={{ 
                            border: '3px solid #000', 
                            padding: '25px', 
                            marginBottom: '20px', 
                            backgroundColor: '#000',
                            color: '#fff',
                            boxShadow: '10px 10px 0px #ff0000',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Order // #{index + 1}
                                </span>
                                <span style={{ color: '#ff0000', fontWeight: 'bold' }}>
                                    {order.orderDate || 'RECORDED'}
                                </span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', textTransform: 'uppercase' }}>Current Status</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                                        {order.status || 'PROCESSED'}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', textTransform: 'uppercase' }}>Total Charged</p>
                                    <p style={{ margin: 0, fontWeight: '900', fontSize: '1.8rem', color: '#ff0000' }}>
                                        €{order.totalPrice}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: '10px', fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                                ID: {order.publicId || 'N/A'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px', 
                        border: '4px solid #000',
                        backgroundColor: '#fff',
                        boxShadow: '10px 10px 0px #000'
                    }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>
                            No orders found
                        </p>
                        <p style={{ color: '#ff0000', marginTop: '10px' }}>GO BUY SOMETHING</p>
                    </div>
                )}
            </div>
        </div>
    );
}