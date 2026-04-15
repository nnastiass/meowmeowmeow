import { useState } from 'react';

export default function CategoryForm({ onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            setError('Category name and description are required.');
            return;
        }

        setStatus(null);
        setError(null);
        onCreate({ name: name.trim(), description: description.trim() });
        setName('');
        setDescription('');
        setStatus('Category created successfully.');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Category Name:
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
            <button type="submit">Create Category</button>
            {status && <p style={{ color: 'green' }}>{status}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
