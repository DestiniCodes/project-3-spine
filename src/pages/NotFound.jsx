import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', color: 'var(--primary)', fontWeight: 700, lineHeight: 1 }}>404</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text)', margin: '16px 0 10px' }}>
          This page got lost on the shelf
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          Maybe it was misfiled. Let's get you back to your library.
        </p>
        <Link to="/" className="btn btn-primary">← Back to Library</Link>
      </div>
    </div>
  );
}
