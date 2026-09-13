import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import SearchFilters from '../components/SearchFilters';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formVersion, setFormVersion] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [editingRecipe, setEditingRecipe] = useState(location.state?.editingRecipe ?? null);
  const [message, setMessage] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getRecipes();
      setRecipes(response ?? []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.editingRecipe) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let active = true;
    api.getRecipes().then((response) => {
      if (active) setRecipes(response ?? []);
    }).catch((apiError) => {
      if (active) setError(apiError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))],
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || recipe.category === category;
      const matchesDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, searchTerm, category, difficulty]);

  const handleCreate = async (recipeData) => {
    setMessage('');
    setError('');

    try {
      await api.createRecipe(recipeData);
      setMessage('Receta creada correctamente.');
      setFormVersion((value) => value + 1);
      setEditingRecipe(null);
      await fetchRecipes();
      return true;
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleUpdate = async (recipeData) => {
    setMessage('');
    setError('');

    try {
      await api.updateRecipe(editingRecipe.id, recipeData);
      setMessage('Receta actualizada correctamente.');
      setEditingRecipe(null);
      await fetchRecipes();
      return true;
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('¿Deseas eliminar esta receta?')) {
      return;
    }

    try {
      await api.deleteRecipe(recipeId);
      if (editingRecipe?.id === recipeId) setEditingRecipe(null);
      setMessage('Receta eliminada correctamente.');
      fetchRecipes();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // La sesión local se elimina incluso si la conexión falla.
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Catálogo de Recetas</p>
          <h1>Mis recetas</h1>
        </div>
        <button type="button" className="secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <section className="panel">
        <h2>{editingRecipe ? 'Editar receta' : 'Nueva receta'}</h2>
        <RecipeForm
          key={`${editingRecipe?.id ?? 'new'}-${formVersion}`}
          initialRecipe={editingRecipe}
          onSubmit={editingRecipe ? handleUpdate : handleCreate}
          submitLabel={editingRecipe ? 'Guardar cambios' : 'Crear receta'}
          onCancel={() => setEditingRecipe(null)}
          isEditing={Boolean(editingRecipe)}
        />
      </section>

      <section className="panel">
        <h2>Recetas</h2>
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          categories={categories}
        />

        {loading ? (
          <p>Cargando recetas...</p>
        ) : filteredRecipes.length === 0 ? (
          <p>No hay recetas disponibles.</p>
        ) : (
          <div className="recipe-list">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
                onEdit={setEditingRecipe}
                onView={(id) => navigate(`/recipes/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
