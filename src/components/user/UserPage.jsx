import { useState } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";
import LoginForm from "./LoginForm";
import { getUsers, deleteUser } from "../../api/userAPI"; 

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Admin check failed or session expired.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("You sure?")) {
            try {
                await deleteUser(id); 
                alert("You deleted a user, bro");
                loadUsers(); 
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (currentUser) {
        return (
            <div style={containerStyle}>
                <div style={boxStyle}>
                    <h2 style={headerStyle}>Welcome, {currentUser.name}</h2>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#ff0000', marginBottom: '20px' }}>
                        Session Active // Role: {currentUser.role || 'User'}
                    </p>
                    <button onClick={() => setCurrentUser(null)} style={secondaryButtonStyle}>
                        Logout
                    </button>
                    <hr style={{ border: 'none', height: '4px', backgroundColor: '#000', margin: '30px 0' }} />
                    <UserList users={users} onDelete={handleDelete} />
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                {showRegister ? (
                    <>
                        <h2 style={headerStyle}>Establish Identity</h2>
                        <UserForm onUserCreated={() => setShowRegister(false)} />
                        <button onClick={() => setShowRegister(false)} style={switchButtonStyle}>
                             <span style={{ color: '#ff0000' }}>Login</span>
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={headerStyle}>Log in if you want to</h2>
                        <LoginForm onLoginSuccess={(user) => {
                            setCurrentUser(user);
                            loadUsers();
                        }} />
                        <button onClick={() => setShowRegister(true)} style={switchButtonStyle}>
                            <span style={{ color: '#ff0000' }}>Register</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    backgroundColor: '#ffffff',
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
};

const boxStyle = {
    width: '100%',
    maxWidth: '500px',
    border: '4px solid #000',
    padding: '40px',
    backgroundColor: '#fff',
    boxShadow: '15px 15px 0px #000',
    textAlign: 'center'
};

const headerStyle = {
    textTransform: 'uppercase',
    letterSpacing: '3px',
    fontSize: '1.8rem',
    marginBottom: '20px',
    borderBottom: '6px solid #ff0000',
    display: 'inline-block',
    paddingBottom: '5px'
};

const secondaryButtonStyle = {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '1px'
};

const switchButtonStyle = {
    background: 'none',
    border: 'none',
    marginTop: '25px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    cursor: 'pointer',
    letterSpacing: '1px',
    display: 'block',
    width: '100%'
};