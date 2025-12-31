export default function SimplePage({ title, children }) {
  return (
    <section className="content-section" style={{ marginTop: 120 }}>
      <h2>{title}</h2>
      {children ?? <p>内容建设中。</p>}
    </section>
  );
}


