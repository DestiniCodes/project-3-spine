import { progressPercent } from '../utils/helpers';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120"><rect width="80" height="120" fill="%23e8e0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23a09088">📖</text></svg>';

function ProgressRing({ percent, size = 48 }) {
  const r  = (size - 6) / 2;
  const c  = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle className="progress-ring-bg" cx={size/2} cy={size/2} r={r} strokeWidth="5" />
      <circle
        className="progress-ring-fill"
        cx={size/2} cy={size/2} r={r} strokeWidth="5"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function HeroCard({ book, onClick }) {
  const pct = progressPercent(book);

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '0 4px 20px var(--shadow-md)',
        cursor: 'pointer',
        minWidth: '280px',
        maxWidth: '340px',
        flex: '0 0 auto',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderTop: '4px solid var(--primary)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-md)'; }}
    >
      <img
        src={book.coverImage || COVER_PLACEHOLDER}
        alt={book.title}
        style={{ width: '64px', height: '92px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 8px var(--shadow)', flexShrink: 0 }}
        onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>
          Currently Reading
        </p>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.25, marginBottom: '4px' }}>
          {book.title}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {book.authors?.join(', ')}
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ProgressRing percent={pct} />
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{pct}%</p>
            {book.pageCount && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                pg {book.currentPage || 0} of {book.pageCount}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CurrentlyReadingHero({ books, onBookClick }) {
  if (!books.length) return null;

  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px', scrollSnapType: 'x mandatory' }}>
        {books.map((book) => (
          <div key={book.id} style={{ scrollSnapAlign: 'start' }}>
            <HeroCard book={book} onClick={() => onBookClick(book)} />
          </div>
        ))}
      </div>
    </section>
  );
}
