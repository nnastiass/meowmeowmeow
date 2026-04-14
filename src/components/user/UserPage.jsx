import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import { getUsers } from "../../api/userAPI";
import UserList from "./UserList";

export default function UserPage({ currentUser, onLogin, onLogout, onUserCreated }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        getUsers()
        .then(setUsers)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    const handleUserCreated = (user) => {
        setUsers((prevUsers) => [...prevUsers, user]);
        onUserCreated?.(user);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const normalizedEmail = loginEmail.trim().toLowerCase();
        const user = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
        if (!user) {
            setAuthError('No user found with that email. Please register first.');
            return;
        }

        console.log(`Logged in as ${user.name} with role ${user.role || 'normal'}`);
        onLogin?.(user);
        setLoginEmail('');
        setAuthError(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div>
                {currentUser ? (
                    <div>
                        <p>
                            Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 ? 'admin' : 'normal'})
                        </p>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                ) : (
                    <form onSubmit={handleLoginSubmit} style={{ marginBottom: '1rem' }}>
                        <h2>Login</h2>
                        <div>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </label>
                        </div>
                        <button type="submit">Login</button>
                        {authError && <p style={{ color: 'red' }}>{authError}</p>}
                    </form>
                )}
            </div>

            <h2>Users</h2>
            <UserList users={users} currentUser={currentUser} />

            <h2>Register</h2>
            <UserForm onUserCreated={handleUserCreated} />
        </div>
    );
}