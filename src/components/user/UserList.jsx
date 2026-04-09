export default function UserList({ users, onDelete }) {
    return (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3 style={listHeaderStyle}>Database</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map(user => (
                    <li key={user.publicId || user.email} style={listItemStyle}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: '900', fontSize: '1.1rem', textTransform: 'uppercase' }}>
                                {user.name}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#666', letterSpacing: '1px' }}>
                                {user.email.toUpperCase()}
                            </span>
                        </div>
                        
                        <button 
                            onClick={() => onDelete(user.publicId)}
                            style={deleteButtonStyle}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {users.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    // No entities found in database
                </p>
            )}
        </div>
    );
}

const listHeaderStyle = {
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '20px',
    color: '#000',
    borderBottom: '2px solid #000',
    paddingBottom: '5px'
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '10px',
    border: '2px solid #000',
    backgroundColor: '#fff',
    boxShadow: '4px 4px 0px #000', 
    transition: 'transform 0.1s'
};

const deleteButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ff0000',
    border: '2px solid #ff0000',
    padding: '5px 15px',
    textTransform: 'uppercase',
    fontWeight: '900',
    fontSize: '0.7rem',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.2s',
};