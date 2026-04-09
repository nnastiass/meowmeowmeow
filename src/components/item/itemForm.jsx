import { useState } from 'react';
import { postItem } from '../../api/itemAPI';

export default function ItemForm({ onItemCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemToSend = {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            stockQuantity: 10, 
            categoryId: "a3da5856-f509-4de3-b1ab-166b426dba81", 
            categoryName: "Category1" 
        };

        try {
            await postItem(itemToSend);
            alert("Item created!");
            setFormData({ name: '', description: '', price: 0 });

            if (onItemCreated) {
                onItemCreated(); 
            }
        } catch (err) {
            alert("Error: " + err.message);
            console.error("Fetch error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3 style={headerStyle}>Add New Product</h3>
            
            <input 
                placeholder="PRODUCT NAME" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                style={inputStyle}
            />
            
            <input 
                placeholder="DESCRIPTION" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={inputStyle}
            />
            
            <input 
                type="number" 
                placeholder="PRICE" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
                style={inputStyle}
            />
            
            <button type="submit" style={buttonStyle}>
                Create Item
            </button>
        </form>
    );
}

const formStyle = {
    marginBottom: '40px',
    border: '4px solid #000',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '10px 10px 0px #000', 
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const headerStyle = {
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontSize: '1.2rem',
    borderLeft: '8px solid #ff0000',
    paddingLeft: '15px'
};

const inputStyle = {
    padding: '12px',
    border: '2px solid #000',
    fontSize: '1rem',
    outline: 'none',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'inherit'
};

const buttonStyle = {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px',
    border: '2px solid #000',

    backgroundColor: '#ff0000' 
};