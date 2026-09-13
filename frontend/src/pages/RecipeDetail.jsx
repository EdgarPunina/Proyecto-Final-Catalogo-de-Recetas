import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.getRecipe(id);
        setRecipe(response);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Deseas eliminar esta receta?')) {
      return;
    }

    try {
      await api.deleteRecipe(id);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  if (loading) {
    return <p>Cargando receta...</p>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  if (!recipe) {
    return <p>Receta no encontrada.</p>;
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail-header">
        <div>
          <p className="eyebrow">{recipe.category}</p>
          <h1>{recipe.title}</h1>
        </div>
        <Link to="/dashboard" className="secondary-link">
          Volver al dashboard
        </Link>
      </div>

      {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />}

      <div className="detail-grid">
        <div>
          <h2>Descripción</h2>
          <p>{recipe.description || 'Sin descripción adicional.'}</p>
        </div>
        <div>
          <h2>Detalles</h2>
          <ul>
            <li>Dificultad: {recipe.difficulty}</li>
            <li>Preparación: {recipe.preparation_time} min</li>
            <li>Cocción: {recipe.cooking_time} min</li>
            <li>Porciones: {recipe.servings}</li>
          </ul>
        </div>
      </div>

      <div className="detail-section">
        <h2>Ingredientes</h2>
        <p>{recipe.ingredients}</p>
      </div>

      <div className="detail-section">
        <h2>Instrucciones</h2>
        <p>{recipe.instructions}</p>
      </div>

      <div className="detail-actions">
        <button
          type="button"
          className="primary"
          onClick={() => navigate('/dashboard', { state: { editingRecipe: recipe } })}
        >
          Editar
        </button>
        <button type="button" className="danger" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
