import { registerUser, loginUser } from "../../api/userAPI";
import { useState } from 'react';

export default function UserForm({ onUserCreated }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('2000-01-01');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setError(null);

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !address.trim() || !phoneNumber.trim()) {
            setError('First name, last name, email, password, address, and phone number are required.');
            return;
        }

        const newUser = {
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: password.trim(),
            address: address.trim(),
            phoneNumber: phoneNumber.trim(),
            dateOfBirth,
        };

        try {
            await registerUser(newUser);
            const loginResult = await loginUser(newUser.email, newUser.password);
            setStatus('User created and logged in.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setPhoneNumber('');
            setDateOfBirth('2000-01-01');
            onUserCreated?.({
                name: loginResult.name || `${loginResult.firstName || newUser.firstName} ${loginResult.lastName || newUser.lastName}`,
                firstName: loginResult.firstName || newUser.firstName,
                lastName: loginResult.lastName || newUser.lastName,
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
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                    Address:
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Phone Number:
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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