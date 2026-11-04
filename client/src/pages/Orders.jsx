import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders', { token })
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="empty">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0)
    return (
      <div className="empty">
        <h2>No orders yet</h2>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.map((o) => (
        <div className="order-card" key={o.id}>
          <div className="order-head">
            <strong>#{o.id}</strong>
            <span className="tag">{o.status}</span>
            <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          {o.items.map((i) => (
            <div className="summary-row" key={i.productId}>
              <span>{i.name} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="summary-row total"><span>Total</span><span>₹{o.total}</span></div>
        </div>
      ))}
    </div>
  );
}