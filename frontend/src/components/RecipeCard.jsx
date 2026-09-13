export default function RecipeCard({ recipe, onDelete, onEdit, onView }) {
  return (
    <article className="recipe-card">
      <div className={`recipe-cover cover-${recipe.id % 3}`}>
        {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : null}
        <span className="cover-symbol" aria-hidden="true">✳</span><span className="cover-label">DE MI RECETARIO</span>
      </div>
      <div className="recipe-card-body">
      <div className="recipe-card-header">
        <div>
          <p className="eyebrow">{recipe.category}</p>
          <h3>{recipe.title}</h3>
        </div>
        <span className={`difficulty difficulty-${recipe.difficulty}`}>{{ easy: 'Fácil', medium: 'Media', hard: 'Difícil' }[recipe.difficulty]}</span>
      </div>

      <p className="recipe-description">{recipe.description || 'Sin descripción adicional.'}</p>

      <dl className="recipe-meta">
        <div>
          <dt>Tiempo</dt>
          <dd>
            {recipe.preparation_time + recipe.cooking_time} min
          </dd>
        </div>
        <div>
          <dt>Porciones</dt>
          <dd>{recipe.servings}</dd>
        </div>
      </dl>

      <div className="recipe-card-actions">
        <button type="button" className="secondary" onClick={() => onView(recipe.id)}>
          Ver detalle
        </button>
        <button type="button" className="secondary" onClick={() => onEdit(recipe)}>
          Editar
        </button>
        <button type="button" className="danger" onClick={() => onDelete(recipe.id)}>
          Eliminar
        </button>
      </div>
      </div>
    </article>
  );
}
