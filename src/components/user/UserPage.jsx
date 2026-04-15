import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import { getUsers, loginUser } from "../../api/userAPI";
import UserList from "./UserList";

export default function UserPage({ currentUser, onLogin, onLogout, onUserCreated }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setAuthError(null);

        try {
            const result = await loginUser(loginEmail.trim(), loginPassword);
            const normalizedUser = {
                name: result.name || `${result.firstName || ''} ${result.lastName || ''}`.trim() || loginEmail.trim(),
                firstName: result.firstName,
                lastName: result.lastName,
                email: loginEmail.trim(),
                role: result.role,
                publicId: result.publicId,
                id: result.publicId,
            };
            onLogin?.(normalizedUser);
            setLoginEmail('');
            setLoginPassword('');
        } catch (loginError) {
            setAuthError(loginError.message || 'Login failed.');
        }
    };

    // ... top of your file remains exactly the same ...

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // 1. Create a clean variable to check if the current user is an admin
    const isAdmin = currentUser?.role === 2 || String(currentUser?.role).toLowerCase() === 'admin';

    return (
        <div>
            <div>
                {currentUser ? (
                    <div>
                        <p>
                            Logged in as <strong>{currentUser.name}</strong> ({isAdmin ? 'admin' : 'customer'})
                        </p>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                ) : (
                    // ... login form remains exactly the same ...
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
                        <div>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </label>
                        </div>
                        <button type="submit">Login</button>
                        {authError && <p style={{ color: 'red' }}>{authError}</p>}
                    </form>
                )}
            </div>

            {/* 2. ONLY render this entire section if the user is an admin */}
            {isAdmin && (
                <>
                    <h2>Users</h2>
                    <UserList users={users} currentUser={currentUser} />
                </>
            )}

            <h2>Register</h2>
            <UserForm onUserCreated={handleUserCreated} />
        </div>
    );
}