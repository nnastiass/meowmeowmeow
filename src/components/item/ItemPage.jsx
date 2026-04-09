import { useEffect, useState } from "react";
import { getItems, deleteItem } from "../../api/itemAPI";
import ItemForm from "./itemForm";

export default function ItemPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadItems = () => {
        getItems()
            .then(data => setItems(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (publicId) => {
        if (window.confirm("Delete this item?")) {
            try {
                await deleteItem(publicId);
                loadItems(); 
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <p style={{ color: '#ff0000', textAlign: 'center', fontWeight: 'bold' }}>Loading shop...</p>;

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px', color: '#000000' }}>
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '4px',
                marginBottom: '40px',
                borderBottom: '5px solid #ff0000',
                display: 'inline-block',
                width: '100%',
                paddingBottom: '10px'
            }}>
                Store Management
            </h2>
            
            <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
                <ItemForm onItemCreated={loadItems} />
            </div>

            <hr style={{ border: 'none', height: '2px', backgroundColor: '#000', marginBottom: '40px' }} />

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '30px',
                padding: '0 20px'
            }}>
                {items.map(item => (
                    <div key={item.publicId} style={{ 
                        border: '2px solid #000', 
                        padding: '20px', 
                        borderRadius: '0px',
                        backgroundColor: '#000',
                        color: '#fff',
                        transition: 'transform 0.2s',
                        boxShadow: '8px 8px 0px #ff0000'
                    }}>
                        <h3 style={{ textTransform: 'uppercase', margin: '0 0 10px 0', borderLeft: '4px solid #ff0000', paddingLeft: '10px' }}>
                            {item.name}
                        </h3>
                        <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>{item.description}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#ff0000', margin: '0 0 20px 0' }}>€{item.price}</p>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                                onClick={() => {
                                    import('../../api/cartAPI').then(api => {
                                        api.addToCart(item)
                                            .then(() => alert(`${item.name} added to cart!`))
                                            .catch(() => alert("Failed to add. Is the backend alive?"));
                                    });
                                }}
                                style={{ 
                                    flex: 2,
                                    backgroundColor: '#ff0000', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '12px', 
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer' 
                                }}
                            >
                                Add to Cart
                            </button>

                            <button 
                                onClick={() => {
                                    import('../../api/favouriteAPI').then(api => {
                                        api.toggleFavourite(item.publicId).then(() => alert("No way you liked smth"));
                                    });
                                }}
                                style={{ 
                                    flex: 1, 
                                    backgroundColor: 'transparent', 
                                    color: '#fff', 
                                    border: '1px solid #fff', 
                                    padding: '8px',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer' 
                                }}
                            >
                                Like
                            </button>

                            <button 
                                onClick={() => handleDelete(item.publicId)}
                                style={{ 
                                    flex: 1, 
                                    backgroundColor: 'transparent', 
                                    color: '#fff', 
                                    border: '1px solid #fff', 
                                    padding: '8px',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer' 
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}