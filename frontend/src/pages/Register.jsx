import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthStory from '../components/AuthStory';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousValue) => ({
      ...previousValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.register(formData);
      localStorage.setItem('recipe_token', response.token);
      localStorage.setItem('recipe_user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthStory />
      <div className="auth-card">
        <p className="eyebrow">EMPIEZA TU COLECCIÓN</p>
        <h1>Crear cuenta</h1>
        <p className="auth-intro">Dale un lugar a esas recetas que quieres repetir.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
