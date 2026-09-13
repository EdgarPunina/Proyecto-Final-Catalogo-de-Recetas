import { useState } from 'react';

const initialValues = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  category: '',
  difficulty: 'easy',
  preparation_time: 0,
  cooking_time: 0,
  servings: 1,
  image_url: '',
};

export default function RecipeForm({ initialRecipe, onSubmit, submitLabel, onCancel, isEditing }) {
  const [formData, setFormData] = useState(() => initialRecipe
    ? { ...Object.fromEntries(Object.keys(initialValues).map((key) => [key, initialRecipe[key]])), description: initialRecipe.description || '', image_url: initialRecipe.image_url || '' }
    : initialValues);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousValue) => ({
      ...previousValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Título
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Categoría
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Dificultad
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
        </label>

        <label>
          Preparación (min)
          <input
            type="number"
            min="0"
            name="preparation_time"
            value={formData.preparation_time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Cocción (min)
          <input
            type="number"
            min="0"
            name="cooking_time"
            value={formData.cooking_time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Porciones
          <input
            type="number"
            min="1"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Descripción
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </label>

      <label>
        Ingredientes
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          rows="4"
          required
        />
      </label>

      <label>
        Instrucciones
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows="5"
          required
        />
      </label>

      <label>
        URL de imagen
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/recipe.jpg"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? 'Guardando...' : submitLabel}
        </button>
        {isEditing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
