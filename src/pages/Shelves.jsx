import { useState } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import LibraryCardModal from '../components/LibraryCardModal';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"><rect width="60" height="90" fill="%23C4966A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="22" fill="%23fff" opacity="0.5">📖</text></svg>';

export default function Shelves() {
  const { shelves, activeLibrary, addShelf, renameShelf, removeShelf, assignShelf } = useLibrary();
  const [newName, setNewName]         = useState('');
  const [editing, setEditing]         = useState(null);
  const [editName, setEditName]       = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [addingTo, setAddingTo]       = useState(null); // shelf id whose picker is open
  const [bookFilter, setBookFilter]   = useState('');   // search within the picker

  const handleAdd = () => {
    if (!newName.trim()) return;
    addShelf(newName.trim());
    setNewName('');
  };

  const handleRename = (id) => {
    if (!editName.trim()) return;
    renameShelf(id, editName.trim());
    setEditing(null);
  };

  const booksOnShelf = (shelfId) =>
    activeLibrary.filter((b) => b.shelves?.includes(shelfId));

  // filtered picker books
  const pickerBooks = activeLibrary.filter((b) =>
    bookFilter.trim() === '' ||
    b.title.toLowerCase().includes(bookFilter.toLowerCase()) ||
    b.authors?.some((a) => a.toLowerCase().includes(bookFilter.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>

        <p className="badge" style={{ marginBottom: '10px' }}>Organization</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
          My Shelves
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Organize your books into custom collections. A book can live on multiple shelves.
        </p>

        {/* New shelf input */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '44px', maxWidth: '420px' }}>
          <input
            className="input"
            placeholder="e.g. May TBR, Rom Com Faves…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd} style={{ flexShrink: 0 }}>
            + New Shelf
          </button>
        </div>

        {/* Empty state */}
        {shelves.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🗂️</div>
            <h3>No shelves yet</h3>
            <p>Create your first shelf to start organizing your books.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            {shelves.map((shelf) => {
              const books    = booksOnShelf(shelf.id);
              const isEditing  = editing === shelf.id;
              const pickerOpen = addingTo === shelf.id;

              return (
                <div key={shelf.id}>

                  {/* Shelf label row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {isEditing ? (
                      <>
                        <input
                          className="input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(shelf.id);
                            if (e.key === 'Escape') setEditing(null);
                          }}
                          autoFocus
                          style={{ maxWidth: '260px' }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleRename(shelf.id)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
                          {shelf.name}
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {books.length} book{books.length !== 1 ? 's' : ''}
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setAddingTo(pickerOpen ? null : shelf.id);
                              setBookFilter('');
                            }}
                          >
                            {pickerOpen ? '✕ Done' : '+ Add Books'}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => { setEditing(shelf.id); setEditName(shelf.name); }}
                          >
                            ✏️ Rename
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => removeShelf(shelf.id)}
                            style={{ color: '#B05A5A', borderColor: '#B05A5A' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Book picker panel */}
                  {pickerOpen && (
                    <div style={{
                      background: 'var(--surface)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      marginBottom: '14px',
                    }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                        Select books to add or remove from <em>{shelf.name}</em>:
                      </p>

                      {activeLibrary.length === 0 ? (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          No books in your library yet. Add some from the Search page.
                        </p>
                      ) : (
                        <>
                          {/* Filter input */}
                          <input
                            className="input"
                            placeholder="Filter by title or author…"
                            value={bookFilter}
                            onChange={(e) => setBookFilter(e.target.value)}
                            style={{ marginBottom: '12px', fontSize: '0.82rem' }}
                          />

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                            {pickerBooks.map((book) => {
                              const on = book.shelves?.includes(shelf.id);
                              return (
                                <button
                                  key={book.id}
                                  onClick={() => assignShelf(book.id, shelf.id)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '8px 12px', borderRadius: 'var(--radius-md)',
                                    border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                                    background: on ? 'var(--primary-dim)' : 'var(--surface)',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                  }}
                                >
                                  <img
                                    src={book.coverImage || COVER_PLACEHOLDER}
                                    alt=""
                                    style={{ width: '28px', height: '42px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                                    onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
                                  />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: on ? 'var(--primary)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {book.title}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                      {book.authors?.[0]}
                                    </p>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: on ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                                    {on ? '✓ Added' : '+ Add'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Visual bookshelf */}
                  <div className="bookshelf-wrap">
                    <div className="bookshelf-books">
                      {books.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', alignSelf: 'center', paddingBottom: '8px' }}>
                          No books yet — tap "+ Add Books" above to get started.
                        </p>
                      ) : (
                        books.map((book) => (
                          <div
                            key={book.id}
                            className="book-spine-cover"
                            onClick={() => setSelectedBook(book)}
                            title={`${book.title}${book.authors?.[0] ? ' · ' + book.authors[0] : ''}`}
                          >
                            <img
                              src={book.coverImage || COVER_PLACEHOLDER}
                              alt={book.title}
                              style={{
                                width: '60px', height: '90px',
                                objectFit: 'cover',
                                borderRadius: '3px 2px 2px 3px',
                                boxShadow: '2px 0 10px rgba(0,0,0,0.35)',
                                display: 'block',
                              }}
                              onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                    <div className="bookshelf-plank" />
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {selectedBook && (
        <LibraryCardModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
