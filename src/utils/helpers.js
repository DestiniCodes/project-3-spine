export const uid = () => crypto.randomUUID();
export const today = () => new Date().toISOString().split('T')[0];

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

export const currentYear = () => new Date().getFullYear();
export const RATING_OPTIONS = Array.from({ length: 17 }, (_, i) => +(1 + i * 0.25).toFixed(2));

export const formatRating = (r) => {
  if (!r) return '—';
  return r % 1 === 0 ? `${r}.0` : String(r);
};
export const starsFromRating = (rating) => {
  if (!rating) return '';
  return '★'.repeat(Math.floor(rating));
};
export const STATUS_META = {
  'want-to-read': { label: 'Want to Read',       css: 'status-want'    },
  'reading':      { label: 'Currently Reading',  css: 'status-reading'  },
  'finished':     { label: 'Finished',           css: 'status-finished' },
  'dnf':          { label: 'Did Not Finish',     css: 'status-dnf'     },
  'paused':       { label: 'Paused',             css: 'status-paused'  },
};
export const progressPercent = (book) => {
  if (!book.currentPage || !book.pageCount) return 0;
  return Math.min(100, Math.round((book.currentPage / book.pageCount) * 100));
};
export const purchaseLinks = (book) => {
  const q = encodeURIComponent(`${book.title} ${(book.authors || []).join(' ')}`);
  const isbn = book.isbn ? encodeURIComponent(book.isbn) : null;
  return [
    { name: 'Amazon',          url: `https://www.amazon.com/s?k=${isbn || q}`, icon: '🛒' },
    { name: 'Barnes & Noble',  url: `https://www.barnesandnoble.com/s/${q}`,   icon: '📚' },
    { name: 'Books-A-Million', url: `https://www.booksamillion.com/search?query=${q}`, icon: '📖' },
    { name: 'Kobo',            url: `https://www.kobo.com/us/en/search?query=${q}`,   icon: '📱' },
  ];
};
export const exportLibrary = (library, shelves, userProfile) => {
  const data = { library, shelves, userProfile, exportedAt: new Date().toISOString(), version: 1 };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `spine-library-${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
export const encodeShareBook = (book) => {
  const payload = {
    title:       book.title,
    authors:     book.authors,
    coverImage:  book.coverImage,
    description: book.description,
    rating:      book.rating,
    status:      book.status,
    genres:      book.genres,
    notes:       book.isNotesPublic ? book.notes : null,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
};

export const decodeShareBook = (encoded) => {
  try { return JSON.parse(decodeURIComponent(escape(atob(encoded)))); }
  catch { return null; }
};
export const SORT_FNS = {
  'title-asc':   (a, b) => a.title.localeCompare(b.title),
  'title-desc':  (a, b) => b.title.localeCompare(a.title),
  'author-asc':  (a, b) => (a.authors?.[0] || '').localeCompare(b.authors?.[0] || ''),
  'date-desc':   (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
  'date-asc':    (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
  'rating-desc': (a, b) => (b.rating || 0) - (a.rating || 0),
};
