import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, total, changeQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((i) => (
          <div className="cart-row" key={i.id}>
            <img src={i.image} alt={i.name} />
            <div className="cart-info">
              <h3>{i.name}</h3>
              <p className="muted">₹{i.price}</p>
            </div>
            <div className="qty">
              <button onClick={() => changeQty(i.id, -1)}>−</button>
              <span>{i.quantity}</span>
              <button onClick={() => changeQty(i.id, 1)}>+</button>
            </div>
            <strong className="subtotal">₹{i.price * i.quantity}</strong>
            <button className="remove" onClick={() => removeItem(i.id)}>✕</button>
          </div>
        ))}
      </div>
      <div className="summary">
        <h2>Total: ₹{total}</h2>
        <button className="btn btn-lg" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
      </div>
    </div>
  );
}