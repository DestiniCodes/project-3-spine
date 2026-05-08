import { useState } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import RatingPicker from './RatingPicker';
import { READING_STATUSES, FORMATS, EBOOK_PLATFORMS, AUDIOBOOK_PLATFORMS } from '../data/genres';
import { STATUS_META, starsFromRating, formatDate, purchaseLinks, encodeShareBook } from '../utils/helpers';

const COVER_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180"><rect width="120" height="180" fill="%23e8e0d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="%23a09088">📖</text></svg>';

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
        fontSize: '0.82rem', fontWeight: active ? 700 : 500,
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
        transition: 'all 0.2s', fontFamily: 'var(--font-body)',
      }}
    >
      {label}
    </button>
  );
}

export default function LibraryCardModal({ book, onClose }) {
  const { updateBook, removeBook, toggleFavorite, assignShelf, shelves, genres, tropes, addGenre, addTrope, addRead, updateRead } = useLibrary();
  const [tab, setTab]         = useState('details');
  const [patch, setPatch]     = useState({});
  const [newGenre, setNewGenre] = useState('');
  const [newTrope, setNewTrope] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);

  const b = { ...book, ...patch };
  const set = (key, val) => setPatch((p) => ({ ...p, [key]: val }));
  const save = () => { updateBook(book.id, patch); setPatch({}); };

  const statusMeta = STATUS_META[b.status] || STATUS_META['want-to-read'];
  const links = purchaseLinks(b);

  const platforms = b.format === 'ebook' ? EBOOK_PLATFORMS : b.format === 'audiobook' ? AUDIOBOOK_PLATFORMS : [];

  const toggleTag = (key, tag) => {
    const arr = b[key] || [];
    set(key, arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  };

  const handleAddGenre = () => {
    if (!newGenre.trim()) return;
    addGenre(newGenre.trim());
    toggleTag('genres', newGenre.trim());
    setNewGenre('');
  };

  const handleAddTrope = () => {
    if (!newTrope.trim()) return;
    addTrope(newTrope.trim());
    toggleTag('tropes', newTrope.trim());
    setNewTrope('');
  };

  const shareUrl = `${window.location.origin}/shared?book=${encodeShareBook(b)}`;

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) { save(); onClose(); } }}>
      <div
        className="fade-up"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', gap: '20px', padding: '24px 24px 0',
          background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={b.coverImage || COVER_PLACEHOLDER}
            alt={b.title}
            style={{ width: '80px', height: '116px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 16px var(--shadow-md)', flexShrink: 0, marginBottom: '-1px' }}
            onError={(e) => { e.target.src = COVER_PLACEHOLDER; }}
          />
          <div style={{ flex: 1, paddingBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.25, marginBottom: '4px' }}>
              {b.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {b.authors?.join(', ')}
              {b.publishedDate && ` · ${b.publishedDate.slice(0, 4)}`}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span className={`pill ${statusMeta.css}`}>{statusMeta.label}</span>
              {b.rating && <span className="pill"><span className="star-yellow">{starsFromRating(b.rating)}</span> {b.rating}</span>}
              {b.isFavorite && <span className="pill" style={{ color: '#E05A7A' }}>♥ Favorited</span>}
              {b.reads?.length > 1 && <span className="pill">Read {b.reads.length}×</span>}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', marginTop: '12px', borderTop: '1px solid var(--border)', marginLeft: '-24px', paddingLeft: '24px' }}>
              {['details', 'notes', 'shelves'].map((t) => (
                <TabBtn key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => { save(); setTab(t); }} />
              ))}
            </div>
          </div>

          {/* Close */}
          <button className="btn-icon" onClick={() => { save(); onClose(); }} style={{ alignSelf: 'flex-start', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* ── BODY ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

          {/* ── DETAILS TAB ── */}
          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Status + Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="label">Reading Status</label>
                  <select className="select" value={b.status} onChange={(e) => set('status', e.target.value)}>
                    {READING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Rating</label>
                  <RatingPicker compact value={b.rating} onChange={(v) => set('rating', v)} />
                </div>
              </div>

              {/* Format + Platform */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="label">Format</label>
                  <select className="select" value={b.format} onChange={(e) => set('format', e.target.value)}>
                    {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                {platforms.length > 0 && (
                  <div className="field">
                    <label className="label">Platform</label>
                    <select className="select" value={b.platform || ''} onChange={(e) => set('platform', e.target.value)}>
                      <option value="">Select platform</option>
                      {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="label">{b.format === 'audiobook' ? 'Progress (%)' : 'Current Page'}</label>
                  <input className="input" type="number" min="0" max={b.pageCount || 9999}
                    value={b.currentPage || ''} onChange={(e) => set('currentPage', Number(e.target.value))} />
                </div>
                <div className="field">
                  <label className="label">{b.format === 'audiobook' ? 'Total Duration (mins)' : 'Total Pages'}</label>
                  <input className="input" type="number" min="1"
                    value={b.pageCount || ''} onChange={(e) => set('pageCount', Number(e.target.value))} />
                </div>
              </div>

              {/* Reading Log */}
              <div className="field">
                <label className="label">Reading Log</label>
                {book.reads.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>No reads logged yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                    {book.reads.map((r, i) => (
                      <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', alignItems: 'end' }}>
                        <div>
                          <label className="label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                            {book.reads.length > 1 ? `Read ${i + 1} — Started` : 'Date Started'}
                          </label>
                          <input
                            type="date"
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                            value={r.startDate || ''}
                            onChange={(e) => updateRead(book.id, r.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Date Finished</label>
                          <input
                            type="date"
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                            value={r.endDate || ''}
                            onChange={(e) => updateRead(book.id, r.id, { endDate: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => addRead(book.id, { startDate: '', endDate: null })}
                >
                  + Log a read
                </button>
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                  { key: 'isFavorite',      label: '♥ Favorite'       },
                  { key: 'isSpecialEdition', label: '⭐ Special Edition' },
                  ...(b.format === 'physical' ? [{ key: 'isSignedCopy', label: '✍️ Signed Copy' }] : []),
                  { key: 'isMarkedForUnhaul', label: '📦 Mark to Unhaul' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { if (key === 'isFavorite') { toggleFavorite(book.id); } else { set(key, !b[key]); } }}
                    style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600,
                      border: `1.5px solid ${b[key] ? 'var(--primary)' : 'var(--border)'}`,
                      background: b[key] ? 'var(--primary-dim)' : 'var(--surface)',
                      color: b[key] ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Genres */}
              <div className="field">
                <label className="label">Genres</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {genres.map((g) => (
                    <button key={g} onClick={() => toggleTag('genres', g)} style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      border: `1.5px solid ${(b.genres || []).includes(g) ? 'var(--primary)' : 'var(--border)'}`,
                      background: (b.genres || []).includes(g) ? 'var(--primary-dim)' : 'transparent',
                      color: (b.genres || []).includes(g) ? 'var(--primary)' : 'var(--text-muted)',
                    }}>{g}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" placeholder="Add custom genre..." value={newGenre} onChange={(e) => setNewGenre(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()} style={{ flex: 1 }} />
                  <button className="btn btn-ghost btn-sm" onClick={handleAddGenre}>Add</button>
                </div>
              </div>

              {/* Tropes */}
              <div className="field">
                <label className="label">Tropes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {tropes.map((t) => (
                    <button key={t} onClick={() => toggleTag('tropes', t)} style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      border: `1.5px solid ${(b.tropes || []).includes(t) ? 'var(--accent)' : 'var(--border)'}`,
                      background: (b.tropes || []).includes(t) ? 'var(--accent-dim)' : 'transparent',
                      color: (b.tropes || []).includes(t) ? 'var(--accent)' : 'var(--text-muted)',
                    }}>{t}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" placeholder="Add custom trope..." value={newTrope} onChange={(e) => setNewTrope(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTrope()} style={{ flex: 1 }} />
                  <button className="btn btn-ghost btn-sm" onClick={handleAddTrope}>Add</button>
                </div>
              </div>

              {/* Publisher info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="label">Publisher</label>
                  <input className="input" value={b.publisher || ''} onChange={(e) => set('publisher', e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Published Date</label>
                  <input className="input" value={b.publishedDate || ''} onChange={(e) => set('publishedDate', e.target.value)} />
                </div>
              </div>

              {/* Purchase links */}
              <div>
                <label className="label" style={{ marginBottom: '10px' }}>Find & Purchase</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {links.map((l) => (
                    <a key={l.name} href={l.url} target="_blank" rel="noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px', borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border)', background: 'var(--surface)',
                        fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      {l.icon} {l.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Description */}
              {b.description && (
                <div>
                  <label className="label">Description</label>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {b.description.length > 400 ? b.description.slice(0, 400) + '…' : b.description}
                  </p>
                </div>
              )}

              {/* Danger zone */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '4px' }}>
                {!confirmDel ? (
                  <button className="btn btn-ghost btn-sm" style={{ color: '#B05A5A', borderColor: '#B05A5A' }} onClick={() => setConfirmDel(true)}>
                    Remove from library
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Are you sure?</span>
                    <button className="btn btn-sm" style={{ background: '#B05A5A', color: '#fff' }} onClick={() => { removeBook(book.id); onClose(); }}>Yes, remove</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(false)}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── NOTES TAB ── */}
          {tab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field">
                <label className="label">My Notes</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: '200px' }}
                  placeholder="Thoughts, quotes, feelings, predictions…"
                  value={b.notes || ''}
                  onChange={(e) => set('notes', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="notes-public"
                  checked={b.isNotesPublic || false}
                  onChange={(e) => set('isNotesPublic', e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <label htmlFor="notes-public" style={{ fontSize: '0.83rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  Include notes when sharing this book
                </label>
              </div>

              {/* Share link */}
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <label className="label">Share this book</label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Anyone with this link can view this book{b.isNotesPublic ? ' and your notes' : ''}.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" readOnly value={shareUrl} style={{ fontSize: '0.75rem', flex: 1 }} />
                  <button className="btn btn-primary btn-sm" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
                </div>
              </div>

              {/* Quick shelf assignment */}
              <div className="field">
                <label className="label">Add to Shelf</label>
                {shelves.length === 0 ? (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    No shelves yet — create some on the Shelves page.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {shelves.map((shelf) => {
                      const on = (b.shelves || []).includes(shelf.id);
                      return (
                        <button
                          key={shelf.id}
                          onClick={() => { assignShelf(book.id, shelf.id); set('shelves', on ? (b.shelves || []).filter((s) => s !== shelf.id) : [...(b.shelves || []), shelf.id]); }}
                          style={{
                            padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                            background: on ? 'var(--primary-dim)' : 'transparent',
                            color: on ? 'var(--primary)' : 'var(--text-muted)',
                          }}
                        >
                          {on ? '✓' : '+'} {shelf.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SHELVES TAB ── */}
          {tab === 'shelves' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                A book can live on multiple shelves.
              </p>
              {shelves.length === 0 ? (
                <div className="empty-state">
                  <p>No shelves yet. Create some on the Shelves page.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {shelves.map((shelf) => {
                    const on = (b.shelves || []).includes(shelf.id);
                    return (
                      <button
                        key={shelf.id}
                        onClick={() => { assignShelf(book.id, shelf.id); set('shelves', on ? (b.shelves || []).filter((s) => s !== shelf.id) : [...(b.shelves || []), shelf.id]); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 16px', borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                          background: on ? 'var(--primary-dim)' : 'var(--surface)',
                          cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{on ? '✓' : '+'}</span>
                        <span style={{ fontWeight: on ? 700 : 400, color: on ? 'var(--primary)' : 'var(--text)', fontSize: '0.88rem' }}>
                          {shelf.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Added {formatDate(book.dateAdded)}</span>
          <button className="btn btn-primary btn-sm" onClick={() => { save(); onClose(); }}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
