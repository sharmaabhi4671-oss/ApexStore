import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="muted line-clamp">{product.description}</p>
        <div className="card-bottom">
          <strong>₹{product.price}</strong>
          <button className="btn" onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}