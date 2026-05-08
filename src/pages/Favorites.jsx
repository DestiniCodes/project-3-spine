import { useState } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import BookCard from '../components/BookCard';
import LibraryCardModal from '../components/LibraryCardModal';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>

        <p className="badge" style={{ marginBottom: '10px' }}>Saved</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
          Favorites
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          {favorites.length > 0
            ? `${favorites.length} book${favorites.length !== 1 ? 's' : ''} you've loved.`
            : 'Heart a book to save it here.'}
        </p>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>♡</div>
            <h3>No favorites yet</h3>
            <p>Tap the heart on any book to save it here.</p>
            <Link to="/" className="btn btn-ghost" style={{ marginTop: '8px' }}>
              Go to Library
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {favorites.map((book) => (
              <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
            ))}
          </div>
        )}

      </div>

      {selectedBook && (
        <LibraryCardModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
