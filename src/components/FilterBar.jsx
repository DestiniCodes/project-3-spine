import { READING_STATUSES } from '../data/genres';
import { useLibrary } from '../hooks/useLibrary';

const SORT_OPTIONS = [
  { value: 'date-desc',   label: 'Recently Added' },
  { value: 'date-asc',    label: 'Oldest First'   },
  { value: 'title-asc',   label: 'Title A–Z'      },
  { value: 'title-desc',  label: 'Title Z–A'      },
  { value: 'author-asc',  label: 'Author A–Z'     },
  { value: 'rating-desc', label: 'Highest Rated'  },
];

export default function FilterBar({ filters, setFilters, sort, setSort }) {
  const { shelves, genres } = useLibrary();

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const selectStyle = {
    fontSize: '0.82rem',
    padding: '7px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  const hasFilter = filters.status || filters.genre || filters.shelf || filters.favorite;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>

      {/* Status */}
      <select style={selectStyle} value={filters.status || ''} onChange={(e) => set('status', e.target.value)}>
        <option value="">All statuses</option>
        {READING_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Genre */}
      <select style={selectStyle} value={filters.genre || ''} onChange={(e) => set('genre', e.target.value)}>
        <option value="">All genres</option>
        {genres.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      {/* Shelf */}
      {shelves.length > 0 && (
        <select style={selectStyle} value={filters.shelf || ''} onChange={(e) => set('shelf', e.target.value)}>
          <option value="">All shelves</option>
          {shelves.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}

      {/* Favorites toggle */}
      <button
        onClick={() => set('favorite', !filters.favorite)}
        style={{
          ...selectStyle,
          background: filters.favorite ? 'var(--primary-dim)' : 'var(--surface)',
          color:      filters.favorite ? 'var(--primary)'     : 'var(--text-muted)',
          border:     `1.5px solid ${filters.favorite ? 'var(--primary)' : 'var(--border)'}`,
          fontWeight: filters.favorite ? 600 : 400,
        }}
      >
        ♥ Favorites
      </button>

      {/* Clear */}
      {hasFilter && (
        <button
          onClick={() => setFilters({})}
          style={{ ...selectStyle, color: 'var(--text-muted)', background: 'transparent', border: 'none', textDecoration: 'underline' }}
        >
          Clear filters
        </button>
      )}

      {/* Sort — pushed right */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort</span>
        <select style={selectStyle} value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
