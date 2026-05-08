import { useRef } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { currentYear, starsFromRating } from '../utils/helpers';
import html2canvas from 'html2canvas';

export default function Stats() {
  const { yearStats, userProfile, activeLibrary } = useLibrary();
  const cardRef = useRef(null);
  const year = currentYear();

  const { booksFinished, pagesRead, topGenre, goal } = yearStats;
  const goalPct = goal > 0 ? Math.min(100, Math.round((booksFinished / goal) * 100)) : 0;

  const topRated = [...activeLibrary]
    .filter((b) => b.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const shareCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link   = document.createElement('a');
      link.download = `spine-${year}-wrapped.png`;
      link.href      = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Could not generate share card', e);
    }
  };

  const Stat = ({ value, label }) => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '720px' }}>

        <p className="badge" style={{ marginBottom: '10px' }}>{year} in Books</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
          Your Reading Year
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '36px' }}>
          A quiet look at your reading life this year.
        </p>

        <div
          ref={cardRef}
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: '0 4px 24px var(--shadow-md)',
            marginBottom: '24px',
            borderTop: '6px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Spine</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{year} Reading Recap{userProfile.name ? ` · ${userProfile.name}` : ''}</div>
            </div>
            <div style={{ fontSize: '2rem' }}>📚</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-2)', marginBottom: '28px' }}>
            <Stat value={booksFinished} label="Books Finished" />
            <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
              <Stat value={pagesRead.toLocaleString()} label="Pages Read" />
            </div>
            <Stat value={topGenre || '—'} label="Top Genre" />
          </div>

          {goal > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                  Reading intention: {booksFinished} of {goal} books
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{goalPct}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${goalPct}%`, background: 'var(--primary)', borderRadius: '99px', transition: 'width 1s ease' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                No pressure — just an intention ✨
              </p>
            </div>
          )}

          {topRated.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Highest Rated
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topRated.map((book) => (
                  <div key={book.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {book.coverImage && (
                      <img src={book.coverImage} alt="" style={{ width: '28px', height: '40px', objectFit: 'cover', borderRadius: '3px' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{book.authors?.[0]}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                      <span className="star-yellow">{starsFromRating(book.rating)}</span>
                      <span style={{ color: 'var(--text-muted)' }}> {book.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booksFinished === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.1rem' }}>
              "The best time to start is now."
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={shareCard} style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}>
          📸 Download as Image
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Share to Instagram, Twitter, or wherever you want.
        </p>

      </div>
    </div>
  );
}
