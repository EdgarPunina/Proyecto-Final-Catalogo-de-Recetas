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
        <a className="brand" href="/dashboard"><span className="brand-mark" aria-hidden="true">✳</span> Catálogo de Recetas</a>
        <button type="button" className="secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="catalog-hero">
        <div><p className="eyebrow">TU RECETARIO PERSONAL</p><h1>Mis recetas<span>Un poco de inspiración.<br /><em>Mucho sabor.</em></span></h1><p>Guarda, organiza y vuelve a preparar tus mejores ideas.</p></div>
        <div className="collection-note"><span aria-hidden="true">✳</span><strong>{loading ? '…' : recipes.length}</strong><p>recetas en tu colección</p><a href="#recipe-editor" className="secondary-link" onClick={() => { document.getElementById('recipe-editor').open = true; }}>+ Nueva receta</a></div>
      </section>

      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      <details className="panel editor-panel" id="recipe-editor" open={Boolean(editingRecipe)}>
        <summary>{editingRecipe ? 'Editar receta' : 'Nueva receta'}<span>Ingredientes, pasos y ese toque especial</span></summary>
        <RecipeForm
          key={`${editingRecipe?.id ?? 'new'}-${formVersion}`}
          initialRecipe={editingRecipe}
          onSubmit={editingRecipe ? handleUpdate : handleCreate}
          submitLabel={editingRecipe ? 'Guardar cambios' : 'Crear receta'}
          onCancel={() => setEditingRecipe(null)}
          isEditing={Boolean(editingRecipe)}
        />
      </details>

      <section className="panel collection-panel">
        <div className="section-heading"><div><p className="eyebrow">GUARDADAS POR TI</p><h2>Tu colección</h2></div><span className="result-count">{filteredRecipes.length} recetas</span></div>
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
          <p className="empty-state" role="status">Cargando recetas...</p>
        ) : filteredRecipes.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true">✳</span><h3>{recipes.length ? 'No encontramos esa combinación' : 'Tu próxima receta empieza aquí'}</h3><p>{recipes.length ? 'Prueba otro título o cambia los filtros.' : 'Abre Nueva receta y guarda tu primer plato.'}</p></div>
        ) : (
          <div className="recipe-list">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
                onEdit={(recipe) => { setEditingRecipe(recipe); document.getElementById('recipe-editor').scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                onView={(id) => navigate(`/recipes/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
