import { useState, useEffect } from 'react';
import ItemPage from './components/item/ItemPage';
import CartPage from './components/cart/CartPage';
import UserPage from './components/user/UserPage';
import OrdersPage from './components/order/OrdersPage';
import FavouritesPage from './components/favourite/FavouritesPage';
import { getCart } from './api/cartAPI';

function App() {

  const [view, setView] = useState('shop'); 
  

  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);


  const refreshCartCount = () => {
    getCart()
      .then(data => {

        const count = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    refreshCartCount();
  }, [view]);

  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#ffffffff', minHeight: '100vh' }}>
      
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 30px', 
        backgroundColor: '#000000ff', 
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setView('shop')}>My beautiful shop</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('shop')} style={view === 'shop' ? activeNavStyle : navButtonStyle}>Store</button>
          <button onClick={() => setView('favs')} style={view === 'favs' ? activeNavStyle : navButtonStyle}>Fav</button>
          <button onClick={() => setView('cart')} style={view === 'cart' ? activeNavStyle : navButtonStyle}>
            Cart ({cartCount})
          </button>
          <button onClick={() => setView('orders')} style={view === 'orders' ? activeNavStyle : navButtonStyle}>Orders</button>
          <button onClick={() => setView('users')} style={view === 'users' ? activeNavStyle : navButtonStyle}>
            {currentUser ? `Hi, ${currentUser.name}` : 'Login'} 
          </button>
        </div>
      </nav>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {view === 'shop' && (
          <ItemPage 
            currentUser={currentUser} 
            onAddToCart={refreshCartCount} 
          />
        )}
        
        {view === 'favs' && (
          <FavouritesPage />
        )}
        
        {view === 'cart' && (
          <CartPage onCartUpdate={refreshCartCount} />
        )}

        {view === 'orders' && (
          <OrdersPage />
        )}
        
        {view === 'users' && (
          <UserPage 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
          />
        )}
        
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '0.8rem' }}>
        &copy; Pretty please help
      </footer>
    </div>
  );
}

const navButtonStyle = {
  background: 'red',
  border: '1px solid rgba(0, 0, 0, 0.3)',
  color: 'black',
  padding: '8px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem'
};

const activeNavStyle = {
  ...navButtonStyle,
  backgroundColor: 'red',
  color: '#000000ff',
  fontWeight: 'bold',
  border: '1px solid white'
};

export default App;