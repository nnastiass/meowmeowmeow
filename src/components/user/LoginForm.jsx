import { useState } from 'react';
import { login } from '../../api/userAPI';

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({ email, password });
            alert(`Welcome back, ${user.name}!`);
            if (onLoginSuccess) onLoginSuccess(user);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3 style={headerStyle}>IDENTIFY YOURSELF</h3>
            
            <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={inputStyle}
            />
            
            <input 
                type="password" 
                placeholder="PASSWORD" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={inputStyle}
            />
            
            <button type="submit" style={buttonStyle}>
                Sign In
            </button>
        </form>
    );
}

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px 0',
    backgroundColor: '#fff'
};

const headerStyle = {
    margin: '0 0 10px 0',
    textAlign: 'left',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    color: '#000',
    borderLeft: '8px solid #ff0000',
    paddingLeft: '15px'
};

const inputStyle = {
    padding: '15px',
    border: '3px solid #000',
    fontSize: '1rem',
    fontWeight: 'bold',
    outline: 'none',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
};

const buttonStyle = {
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '18px',
    fontSize: '1.1rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    cursor: 'pointer',
    letterSpacing: '2px',
    boxShadow: '8px 8px 0px #000',
    marginTop: '10px'
};