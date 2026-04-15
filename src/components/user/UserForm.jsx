import { registerUser, loginUser } from "../../api/userAPI";
import { useState } from 'react';

export default function UserForm({ onUserCreated }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('2000-01-01');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setError(null);

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Name, email, and password are required.');
            return;
        }

        const newUser = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            dateOfBirth,
        };

        try {
            await registerUser(newUser);
            const loginResult = await loginUser(newUser.email, newUser.password);
            setStatus('User created and logged in.');
            setName('');
            setEmail('');
            setPassword('');
            setDateOfBirth('2000-01-01');
            onUserCreated?.({
                name: loginResult.name,
                email: newUser.email,
                role: loginResult.role,
                publicId: loginResult.publicId,
                id: loginResult.publicId,
            });
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
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit">Create User</button>
            {status && <p style={{ color: 'green' }}>{status}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}