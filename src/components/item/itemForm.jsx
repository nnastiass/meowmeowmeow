import { useState } from 'react';

export default function ItemForm({ onCreate, categories = [] }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = { 
        Name: name.trim(), 
        Description: description.trim(), 
        CategoryId: categoryId, 
        Price: Number(price) || 0,
        StockQuantity: Number(stockQuantity) || 0
    };


    console.log("Current 'name' state variable:", name);
    console.log("Object:", payload);

    if (!payload.Name || !payload.CategoryId) {
        alert("Name and Category are required!");
        return;
    }

    onCreate(payload);
    setName('');
    setDescription('');
    setCategoryId('');
    setPrice('');
    setStockQuantity('');
};
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </label>
            </div>
            <div>
                <label>
                    Price:
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Stock Quantity:
                    <input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Category:
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">-- Select a Category --</option>
                        {categories.map((cat, idx) => {
                            const catId = cat.publicId ?? cat.PublicId;
                            const catName = cat.name ?? cat.Name;

                            return (
                                <option key={catId ?? idx} value={catId}>
                                    {catName}
                                </option>
                            );
                        })}
                    </select>
                </label>
            </div>
            <button type="submit">Create Item</button>
        </form>
    );
}