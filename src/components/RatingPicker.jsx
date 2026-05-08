import { RATING_OPTIONS, starsFromRating, formatRating } from '../utils/helpers';

export default function RatingPicker({ value, onChange, compact = false }) {
  if (compact) {
    return (
      <select
        className="select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        style={{ width: 'auto', fontSize: '0.85rem' }}
      >
        <option value="">No rating</option>
        {RATING_OPTIONS.map((r) => (
          <option key={r} value={r}>{formatRating(r)} {starsFromRating(r)}</option>
        ))}
      </select>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <button
          className={`btn btn-sm ${!value ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onChange(null)}
          style={{ fontSize: '0.72rem' }}
        >
          —
        </button>
        {RATING_OPTIONS.map((r) => (
          <button
            key={r}
            className={`btn btn-sm ${value === r ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onChange(r)}
            style={{ fontSize: '0.72rem', minWidth: '44px' }}
          >
            {formatRating(r)}
          </button>
        ))}
      </div>
    </div>
  );
}
