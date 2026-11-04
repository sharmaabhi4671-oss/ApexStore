import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api(isLogin ? '/auth/login' : '/auth/register', { method: 'POST', body: form });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
      {!isLogin && (
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required />
      {error && <p className="error">{error}</p>}
      <button className="btn btn-lg" disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
      </button>
      <p className="muted center">
        {isLogin ? (
          <>New here? <Link to="/register">Create an account</Link></>
        ) : (
          <>Already have an account? <Link to="/login">Login</Link></>
        )}
      </p>
    </form>
  );
}