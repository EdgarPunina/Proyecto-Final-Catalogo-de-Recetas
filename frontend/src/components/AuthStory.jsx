export default function AuthStory() {
  return (
    <aside className="auth-story">
      <a className="brand" href="/"> <span className="brand-mark" aria-hidden="true">✳</span> Catálogo de Recetas</a>
      <div className="story-copy">
        <p className="eyebrow">TU COCINA, TU HISTORIA</p>
        <h2>Las buenas recetas<br />merecen <em>quedarse.</em></h2>
        <p>Un lugar para guardar tus sabores, organizar tus ideas y volver a cocinar lo que te encanta.</p>
      </div>
      <div className="culinary-art" aria-hidden="true"><div className="plate"><span>✳</span></div><i className="leaf leaf-one" /><i className="leaf leaf-two" /><i className="leaf leaf-three" /></div>
      <p className="story-footer">HECHO PARA DISFRUTAR EL PROCESO</p>
    </aside>
  );
}
