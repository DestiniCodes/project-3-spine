import { useSearchParams, Link } from 'react-router-dom';
import { decodeShareBook, starsFromRating } from '../utils/helpers';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180"><rect width="120" height="180" fill="%23e8e0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%23a09088">📖</text></svg>';

export default function SharedBook() {
  const [params] = useSearchParams();
  const book     = decodeShareBook(params.get('book') || '');

  if (!book) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text)', marginBottom: '12px' }}>Invalid share link</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This link may have expired or been copied incorrectly.</p>
          <Link to="/" className="btn btn-primary">Go to Spine</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '60px', maxWidth: '560px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Spine</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Someone shared a book with you</p>
        </div>

        <div className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--surface-2)', display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <img
              src={book.coverImage || COVER_PLACEHOLDER}
              alt={book.title}
              style={{ height: '200px', width: 'auto', borderRadius: '6px', boxShadow: '0 8px 28px var(--shadow-md)' }}
              onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
            />
          </div>

          <div style={{ padding: '28px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
              {book.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              {book.authors?.join(', ')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {book.rating && (
                <span className="pill" style={{ color: 'var(--primary)', borderColor: 'var(--primary-dim)' }}>
                  {starsFromRating(book.rating)} {book.rating}
                </span>
              )}
              {book.status && (
                <span className="pill">{book.status.replace('-', ' ')}</span>
              )}
              {book.genres?.map((g) => <span key={g} className="pill">{g}</span>)}
            </div>

            {book.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                {book.description}
              </p>
            )}

            {book.notes && (
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Reader's note
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{book.notes}"
                </p>
              </div>
            )}

            <Link to="/search" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Find this book in Spine →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track your own reading life with{' '}
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Spine</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
