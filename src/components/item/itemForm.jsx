import { useState } from 'react';

export default function ItemForm({ onCreate, categories = [] }) {
    // 1. Rename title to name to match C# ItemDTO
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // 2. Track the Category ID, not the name!
    const [categoryId, setCategoryId] = useState('');
    // 3. Add state for the missing numeric properties
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

    // 4. Send it via the prop
    onCreate(payload);
    
    // Reset forms...
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
                            // Safely grab the correct casing based on how your backend serializes JSON
                            const catId = cat.publicId ?? cat.PublicId;
                            const catName = cat.name ?? cat.Name;

                            return (
                                // The 'value' attribute here is the crucial fix. 
                                // It maps the dropdown selection to the ID instead of the Name.
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