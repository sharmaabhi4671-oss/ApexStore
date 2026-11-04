import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { token, user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', street: '', city: '', pincode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  if (items.length === 0)
    return (
      <div className="empty">
        <h2>Nothing to checkout</h2>
        <Link to="/" className="btn">Go shopping</Link>
      </div>
    );

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: { items: items.map((i) => ({ productId: i.id, quantity: i.quantity })), address },
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <form className="form-card" onSubmit={placeOrder}>
        <h1>Delivery details</h1>
        <input name="fullName" placeholder="Full name" value={address.fullName} onChange={handleChange} required />
        <input name="phone" placeholder="Phone number" value={address.phone} onChange={handleChange} required />
        <input name="street" placeholder="Address" value={address.street} onChange={handleChange} required />
        <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
        <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-lg" disabled={loading}>{loading ? 'Placing order...' : 'Place order'}</button>
      </form>

      <div className="order-summary">
        <h2>Order summary</h2>
        {items.map((i) => (
          <div className="summary-row" key={i.id}>
            <span>{i.name} × {i.quantity}</span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}
        <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
      </div>
    </div>
  );
}