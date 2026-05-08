import { useLibrary } from '../hooks/useLibrary';
import { STATUS_META, starsFromRating } from '../utils/helpers';
import { READING_STATUSES } from '../data/genres';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120"><rect width="80" height="120" fill="%23e8e0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23a09088">📖</text></svg>';

export default function BookCard({ book, onClick }) {
  const { toggleFavorite, updateBook } = useLibrary();
  const statusMeta = STATUS_META[book.status] || STATUS_META['want-to-read'];

  const handleStatusChange = (e) => {
    e.stopPropagation();
    updateBook(book.id, { status: e.target.value });
  };

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '14px 16px',
        cursor: 'pointer',
        borderLeft: `4px solid var(--primary)`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      <img
        src={book.coverImage || COVER_PLACEHOLDER}
        alt={book.title}
        style={{ width: '48px', height: '70px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, boxShadow: '0 2px 8px var(--shadow)' }}
        onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {book.title}
          </h3>
          <button
            className="btn-icon"
            style={{ flexShrink: 0, fontSize: '1rem', color: book.isFavorite ? '#E05A7A' : undefined }}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); }}
            title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {book.isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {book.authors?.join(', ')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>

          <select
            className={`status-select-inline ${statusMeta.css}`}
            value={book.status || 'want-to-read'}
            onClick={(e) => e.stopPropagation()}
            onChange={handleStatusChange}
            title="Change reading status"
          >
            {READING_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {book.rating && (
            <span className="pill">
              <span className="star-yellow">{starsFromRating(book.rating)}</span>
              <span style={{ color: 'var(--text-muted)' }}> {book.rating}</span>
            </span>
          )}

          {book.reads?.length > 1 && (
            <span className="pill" title={`Read ${book.reads.length} times`}>
              Read {book.reads.length}×
            </span>
          )}

          {book.format && book.format !== 'physical' && (
            <span className="pill">{book.format === 'ebook' ? '📱 eBook' : '🎧 Audio'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
