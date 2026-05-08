import { useState, useMemo } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import BookCard from '../components/BookCard';
import CurrentlyReadingHero from '../components/CurrentlyReadingHero';
import FilterBar from '../components/FilterBar';
import LibraryCardModal from '../components/LibraryCardModal';
import { SORT_FNS } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function Library() {
  const { activeLibrary, currentlyReading, userProfile, yearStats } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('date-desc');

  const { booksFinished } = yearStats;
  const tbr = activeLibrary.filter((b) => b.status === 'want-to-read').length;

  const filtered = useMemo(() => {
    let books = activeLibrary.filter((b) => b.status !== 'reading');
    if (filters.status)   books = books.filter((b) => b.status === filters.status);
    if (filters.genre)    books = books.filter((b) => b.genres?.includes(filters.genre));
    if (filters.shelf)    books = books.filter((b) => b.shelves?.includes(filters.shelf));
    if (filters.favorite) books = books.filter((b) => b.isFavorite);
    return [...books].sort(SORT_FNS[sort] || SORT_FNS['date-desc']);
  }, [activeLibrary, filters, sort]);

  const firstName = userProfile.name?.split(' ')[0] || null;
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greeting = firstName ? `${timeGreeting}, ${firstName}.` : 'Your Reading Life.';

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>

        <div style={{
          background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--surface) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          marginBottom: '36px',
          borderLeft: '5px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 20px var(--shadow)',
        }}>
          <div>
            <p className="badge" style={{ marginBottom: '10px' }}>My Library</p>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700,
              color: 'var(--text)', marginBottom: '20px', lineHeight: 1.2,
            }}>
              {greeting}
            </h1>

            <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
              {[
                { value: activeLibrary.length,    label: 'In Library'                     },
                { value: currentlyReading.length, label: 'Reading Now'                    },
                { value: booksFinished,           label: `Read in ${new Date().getFullYear()}` },
                { value: tbr,                     label: 'On TBR'                         },
              ].map(({ value, label }, i) => (
                <div key={label} style={{
                  paddingRight: '24px',
                  marginRight: '24px',
                  borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/search" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '13px 26px', flexShrink: 0 }}>
            + Add a Book
          </Link>
        </div>

        {currentlyReading.length > 0 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>
              📖 Currently Reading
            </h2>
            <CurrentlyReadingHero books={currentlyReading} onBookClick={setSelectedBook} />
          </>
        )}

        {activeLibrary.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📚</div>
            <h3>Your library awaits</h3>
            <p>Search for a book to start building your collection.</p>
            <Link to="/search" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Search Books →
            </Link>
          </div>
        )}

        {activeLibrary.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                My Collection
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {filtered.length} book{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            <FilterBar filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '2rem' }}>🔍</div>
                <h3>No books match</h3>
                <p>Try adjusting your filters.</p>
                <button className="btn btn-ghost" onClick={() => setFilters({})}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {selectedBook && (
        <LibraryCardModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
