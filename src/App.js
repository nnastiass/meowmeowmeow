import './App.css';
import { useEffect, useState } from 'react';
import UserPage from './components/user/UserPage';
import ItemPage from './components/item/ItemPage';
import FavouritePage from './components/favourite/FavouritePage';
import CartPage from './components/cart/CartPage';
import { getCurrentUser, logoutUser as logoutUserApi } from './api/userAPI';

const normalizeUser = (user) => ({
  id: user.id || user.publicId || user.PublicId || null,
  name: user.name || user.Name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '',
  firstName: user.firstName || user.FirstName || null,
  lastName: user.lastName || user.LastName || null,
  email: user.email || user.Email || '',
  role: user.role ?? user.Role ?? 1,
  publicId: user.publicId || user.PublicId || null,
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const normalized = normalizeUser(user);
          setCurrentUser(normalized);
          localStorage.setItem('currentUser', JSON.stringify(normalized));
          return;
        }
      } catch (err) {
        console.warn('Could not restore backend session:', err.message);
      }

      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    restoreSession();
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
    const normalized = normalizeUser(user);
    setCurrentUser(normalized);
    localStorage.setItem('currentUser', JSON.stringify(normalized));
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (err) {
      console.warn('Logout request failed:', err.message);
    }
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
        <button
          type="button"
          onClick={() => setActiveTab('favourites')}
          disabled={activeTab === 'favourites'}
          style={{ marginLeft: '1rem' }}
        >
          Favourites
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          disabled={activeTab === 'cart'}
          style={{ marginLeft: '1rem' }}
        >
          Cart
        </button>
      </div>

      {activeTab === 'users' ? (
        <UserPage currentUser={currentUser} onLogin={loginUser} onLogout={logout} onUserCreated={loginUser} />
      ) : activeTab === 'items' ? (
        <ItemPage currentUser={currentUser} />
      ) : activeTab === 'favourites' ? (
        <FavouritePage currentUser={currentUser} />
      ) : (
        <CartPage currentUser={currentUser} />
      )}
    </div>
  );
}

export default App;
