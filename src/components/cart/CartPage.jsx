import { useEffect, useState } from "react";
import { getCart } from "../../api/cartAPI";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCart()
            .then(data => setCart(data))
            .catch(err => console.error("Cart fetch failed", err))
            .finally(() => setLoading(false));
    }, []);

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (loading) return <p style={{ color: '#ff0000', textAlign: 'center', fontWeight: 'bold', marginTop: '50px' }}>Loading your treasures bro</p>;

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', border: '4px solid #000', backgroundColor: '#fff', boxShadow: '15px 15px 0px #000' }}>
                

                <div style={{ backgroundColor: '#000', color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '3px' }}>Your Cart</h2>
                    <span style={{ backgroundColor: '#ff0000', padding: '5px 15px', fontWeight: 'bold' }}>{cart.length} ITEMS</span>
                </div>

                <div style={{ padding: '30px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px 0' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Your cart is empty. Go find some items!</p>
                            <div style={{ fontSize: '3rem', marginTop: '20px' }}></div>
                        </div>
                    ) : (
                        <>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '30px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '4px solid #ff0000' }}>
                                        <th style={{ padding: '15px 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Item</th>
                                        <th style={{ textTransform: 'uppercase' }}>Qty</th>
                                        <th style={{ textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ textTransform: 'uppercase', textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.publicId} style={{ borderBottom: '2px solid #000' }}>
                                            <td style={{ padding: '20px 10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>€{item.price.toFixed(2)}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ff0000' }}>€{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ borderTop: '4px solid #000', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                                    <span style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Total Amount:</span>
                                    <span style={{ fontSize: '2rem', fontWeight: '900', color: '#000' }}>€{totalPrice.toFixed(2)}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ 
                                        padding: '15px 40px', 
                                        backgroundColor: '#ff0000', 
                                        color: 'white', 
                                        border: 'none', 
                                        fontWeight: 'bold', 
                                        textTransform: 'uppercase', 
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        boxShadow: '5px 5px 0px #000'
                                    }}>
                                        Checkout Now
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                

                <div style={{ height: '15px', backgroundColor: '#ff0000' }}></div>
            </div>
        </div>
    );
}