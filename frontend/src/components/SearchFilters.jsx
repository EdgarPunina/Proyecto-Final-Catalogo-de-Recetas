export default function SearchFilters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  categories,
}) {
  return (
    <div className="filters-panel">
      <label>
        Buscar por título
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ej. Pasta"
        />
      </label>

      <label>
        Categoría
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">Todas</option>
          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </label>

      <label>
        Dificultad
        <select value={difficulty} onChange={(event) => onDifficultyChange(event.target.value)}>
          <option value="all">Todas</option>
          <option value="easy">Fácil</option>
          <option value="medium">Media</option>
          <option value="hard">Difícil</option>
        </select>
      </label>
    </div>
  );
}
