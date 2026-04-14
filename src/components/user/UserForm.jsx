import { postUser } from "../../api/userAPI";
import { useState } from 'react';

export default function UserForm({ onUserCreated }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('normal');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setError(null);

        if (!name.trim() || !email.trim()) {
            setError('Name and email are required.');
            return;
        }

        const newUser = { name: name.trim(), email: email.trim(), role };
        try {
            const result = await postUser(newUser);
            setStatus('User created and logged in.');
            setName('');
            setEmail('');
            setRole('normal');
            onUserCreated?.(result);
        } catch (submissionError) {
            setError('Error creating user: ' + submissionError.message);
        }
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
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Role:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="normal">Normal User</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            </div>
            <button type="submit">Create User</button>
            {status && <p style={{ color: 'green' }}>{status}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}