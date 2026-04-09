import { postUser } from "../../api/userAPI";
import { useState } from 'react';

export default function UserForm({ onUserCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '2000-01-01', 
        phoneNumber: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await postUser(formData);
            console.log('User created:', result);
            alert("Registration successful!");
            if (onUserCreated) onUserCreated(); 
        } catch (error) {
            console.error('Error creating user:', error);
            alert("Registration failed. Check the console.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3 style={headerStyle}>Join the Movement // Register</h3>
            
            <div style={gridStyle}>
                <input name="name" placeholder="FIRST NAME" onChange={handleChange} required style={inputStyle} />
                <input name="lastName" placeholder="LAST NAME" onChange={handleChange} required style={inputStyle} />
                
                <input name="email" type="email" placeholder="EMAIL" onChange={handleChange} required style={fullWidthInput} />
                <input name="password" type="password" placeholder="PASSWORD" onChange={handleChange} required style={fullWidthInput} />
                
                <div style={labelInputGroup}>
                    <label style={labelStyle}>DATE OF BIRTH</label>
                    <input name="dateOfBirth" type="date" onChange={handleChange} required style={inputStyle} />
                </div>
                
                <input name="phoneNumber" placeholder="PHONE NUMBER" onChange={handleChange} style={inputStyle} />
                <input name="address" placeholder="SHIPPING ADDRESS" onChange={handleChange} style={fullWidthInput} />
            </div>

            <button type="submit" style={buttonStyle}>
                Create Account // Initialize
            </button>
        </form>
    );
}

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px 0',
    backgroundColor: '#fff',
    textAlign: 'left'
};

const headerStyle = {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    borderLeft: '8px solid #ff0000',
    paddingLeft: '15px',
    color: '#000'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
};

const inputStyle = {
    padding: '12px',
    border: '3px solid #000',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    outline: 'none',
    textTransform: 'uppercase',
    fontFamily: 'inherit'
};

const fullWidthInput = {
    ...inputStyle,
    gridColumn: 'span 2'
};

const labelInputGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: '900',
    color: '#ff0000',
    letterSpacing: '1px'
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
    marginTop: '20px',
    transition: 'transform 0.1s'
};