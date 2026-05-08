import { useState, useCallback } from 'react';

// Open Library — free, no API key, no quota limits
// Docs: https://openlibrary.org/developers/api
const SEARCH_BASE  = 'https://openlibrary.org/search.json';
const COVER_BASE   = 'https://covers.openlibrary.org/b/id';
const WORKS_BASE   = 'https://openlibrary.org';

// Fields we want from the search endpoint
const FIELDS = [
  'key', 'title', 'author_name', 'first_publish_year',
  'publisher', 'isbn', 'cover_i', 'subject',
  'number_of_pages_median',
].join(',');

// Shape an Open Library search doc into our internal book format
function shapeBook(doc) {
  const coverId = doc.cover_i;
  return {
    googleBooksId: doc.key || '',           // repurposed as our external ID field
    title:         doc.title || 'Unknown Title',
    authors:       doc.author_name || ['Unknown Author'],
    publisher:     doc.publisher?.[0] || '',
    publishedDate: doc.first_publish_year?.toString() || '',
    description:   '',                      // not in search results; fetched separately if needed
    coverImage:    coverId ? `${COVER_BASE}/${coverId}-M.jpg` : '',
    isbn:          doc.isbn?.[0] || '',
    pageCount:     doc.number_of_pages_median || null,
    categories:    (doc.subject || []).slice(0, 4),
  };
}

export function useAPI() {
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const searchBooks = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const url = `${SEARCH_BASE}?q=${encodeURIComponent(query)}&limit=20&fields=${FIELDS}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();

      const shaped = (data.docs || []).map(shapeBook);
      setResults(shaped);

      if (shaped.length === 0) {
        setError(null); // no error, just no results — UI handles empty state
      }
    } catch (err) {
      setError(err.message || 'Could not reach Open Library. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, searchBooks, clearResults };
}
