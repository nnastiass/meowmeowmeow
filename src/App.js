import './App.css';
import { useEffect, useState } from 'react';
import UserPage from './components/user/UserPage';
import ItemPage from './components/item/ItemPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'currentUser') {
        setCurrentUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loginUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="App">
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setActiveTab('users')} disabled={activeTab === 'users'}>
          Users
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          disabled={activeTab === 'items'}
          style={{ marginLeft: '1rem' }}
        >
          Items
        </button>
      </div>

      {activeTab === 'users' ? (
        <UserPage currentUser={currentUser} onLogin={loginUser} onLogout={logout} onUserCreated={loginUser} />
      ) : (
        <ItemPage currentUser={currentUser} />
      )}
    </div>
  );
}

export default App;
