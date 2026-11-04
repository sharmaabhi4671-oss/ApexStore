import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">Apex<span>Store</span></Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {user && <Link to="/orders">Orders</Link>}
          <Link to="/cart" className="cart-link">Cart{count > 0 && <b className="badge">{count}</b>}</Link>
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}