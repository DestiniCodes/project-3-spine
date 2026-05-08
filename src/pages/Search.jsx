import { useState } from 'react';
import { useAPI } from '../hooks/useAPI';
import { useLibrary } from '../hooks/useLibrary';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"><rect width="60" height="90" fill="%23e8e0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23a09088">📖</text></svg>';

export default function Search() {
  const { results, loading, error, searchBooks, clearResults } = useAPI();
  const { addBook, isInLibrary } = useLibrary();
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState({});

  const handleSearch = () => {
    if (query.trim()) searchBooks(query);
  };

  const handleAdd = (book) => {
    addBook(book);
    setAdded((prev) => ({ ...prev, [book.googleBooksId]: true }));
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>

        <p className="badge" style={{ marginBottom: '10px' }}>Discover</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px' }}>
          Search Books
        </h1>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', maxWidth: '560px' }}>
          <input
            className="input"
            placeholder="Title, author, ISBN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ flexShrink: 0 }}>
            {loading ? '…' : 'Search'}
          </button>
          {results.length > 0 && (
            <button className="btn btn-ghost" onClick={() => { clearResults(); setQuery(''); }}>Clear</button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#FAEAEA', color: '#B05A5A', fontSize: '0.88rem', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Finding your next great read…</p>
          </div>
        )}

        {/* Empty prompt */}
        {!loading && !error && results.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h3>Search for your next read</h3>
            <p>Try a title, author name, or ISBN.</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map((book) => {
                const inLib   = isInLibrary(book.googleBooksId);
                const justAdded = added[book.googleBooksId];
                return (
                  <div
                    key={book.googleBooksId}
                    className="card"
                    style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: 'var(--radius-md)' }}
                  >
                    <img
                      src={book.coverImage || COVER_PLACEHOLDER}
                      alt={book.title}
                      style={{ width: '52px', height: '76px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                      onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>
                        {book.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        {book.authors?.join(', ')}
                        {book.publishedDate && ` · ${book.publishedDate.slice(0, 4)}`}
                        {book.publisher && ` · ${book.publisher}`}
                      </p>
                      {book.description && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                          {book.description.length > 160 ? book.description.slice(0, 160) + '…' : book.description}
                        </p>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      {inLib || justAdded ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>✓ In library</span>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAdd(book)}>
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
