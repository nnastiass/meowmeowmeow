import { useState } from 'react';

export default function ItemForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !description.trim()) {
            setError('Title and description are required.');
            return;
        }

        onCreate({ title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
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
            <button type="submit">Create Item</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
