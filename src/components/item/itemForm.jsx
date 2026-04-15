import { useState } from 'react';

export default function ItemForm({ onCreate, categories = [] }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim() || !categoryName.trim()) {
            return;
        }
        onCreate({ title: title.trim(), description: description.trim(), categoryName: categoryName.trim() });
        setTitle('');
        setDescription('');
        setCategoryName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                    Category:
                    <select
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    >
                        <option value="">-- Select a Category --</option>
                        {categories.map((cat, idx) => (
                            <option key={cat.publicId ?? cat.PublicId ?? idx} value={cat.name ?? cat.Name}>
                                {cat.name ?? cat.Name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button type="submit">Create Item</button>
        </form>
    );
}

