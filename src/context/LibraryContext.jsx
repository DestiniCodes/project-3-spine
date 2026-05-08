import { createContext, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { uid, today } from '../utils/helpers';
import { DEFAULT_GENRES } from '../data/genres';
import { DEFAULT_TROPES } from '../data/tropes';

export const LibraryContext = createContext(null);

const DEFAULT_PROFILE = {
  name:          '',
  readingGoal:   12,
  theme:         'rose',
  darkMode:      false,
  setupComplete: false,
};

export function LibraryProvider({ children }) {
  const [library,     setLibrary]     = useLocalStorage('spine-library',  []);
  const [shelves,     setShelves]     = useLocalStorage('spine-shelves',  []);
  const [userProfile, setUserProfile] = useLocalStorage('spine-profile',  DEFAULT_PROFILE);
  const [genres,      setGenres]      = useLocalStorage('spine-genres',   DEFAULT_GENRES);
  const [tropes,      setTropes]      = useLocalStorage('spine-tropes',   DEFAULT_TROPES);
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', userProfile.theme || 'rose');
    html.setAttribute('data-mode',  userProfile.darkMode ? 'dark' : 'light');
  }, [userProfile.theme, userProfile.darkMode]);
  const updateProfile = useCallback((patch) => {
    setUserProfile((p) => ({ ...p, ...patch }));
  }, [setUserProfile]);
  const addBook = useCallback((bookData) => {
    const book = {
      id:              uid(),
      googleBooksId:   bookData.googleBooksId || '',
      title:           bookData.title || '',
      authors:         bookData.authors || [],
      publisher:       bookData.publisher || '',
      publishedDate:   bookData.publishedDate || '',
      description:     bookData.description || '',
      coverImage:      bookData.coverImage || '',
      isbn:            bookData.isbn || '',
      pageCount:       bookData.pageCount || null,
      format:          'physical',
      platform:        '',
      isSpecialEdition: false,
      isSignedCopy:    false,
      genres:          bookData.categories?.slice(0, 2) || [],
      tropes:          [],
      shelves:         [],
      isFavorite:      false,
      isMarkedForUnhaul: false,
      unhaulDate:      null,
      isArchived:      false,
      status:          'want-to-read',
      rating:          null,
      currentPage:     0,
      notes:           '',
      isNotesPublic:   false,
      reads:           [],
      dateAdded:       today(),
    };
    setLibrary((prev) => [book, ...prev]);
    return book.id;
  }, [setLibrary]);

  const updateBook = useCallback((id, patch) => {
    setLibrary((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  }, [setLibrary]);

  const removeBook = useCallback((id) => {
    setLibrary((prev) => prev.filter((b) => b.id !== id));
  }, [setLibrary]);

  const toggleFavorite = useCallback((id) => {
    setLibrary((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  }, [setLibrary]);

  const archiveBook = useCallback((id) => {
    setLibrary((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isArchived: true, isMarkedForUnhaul: false } : b))
    );
  }, [setLibrary]);

  const isInLibrary = useCallback((googleBooksId) => {
    return library.some((b) => b.googleBooksId === googleBooksId);
  }, [library]);
  const addRead = useCallback((bookId, readData) => {
    setLibrary((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const newRead = { id: uid(), startDate: today(), endDate: null, status: 'reading', rating: null, ...readData };
        return { ...b, reads: [...b.reads, newRead] };
      })
    );
  }, [setLibrary]);

  const updateRead = useCallback((bookId, readId, patch) => {
    setLibrary((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return { ...b, reads: b.reads.map((r) => (r.id === readId ? { ...r, ...patch } : r)) };
      })
    );
  }, [setLibrary]);
  const addShelf = useCallback((name) => {
    const shelf = { id: uid(), name, createdDate: today() };
    setShelves((prev) => [...prev, shelf]);
    return shelf.id;
  }, [setShelves]);

  const renameShelf = useCallback((id, name) => {
    setShelves((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }, [setShelves]);

  const removeShelf = useCallback((id) => {
    setShelves((prev) => prev.filter((s) => s.id !== id));
    setLibrary((prev) =>
      prev.map((b) => ({ ...b, shelves: b.shelves.filter((sid) => sid !== id) }))
    );
  }, [setShelves, setLibrary]);

  const assignShelf = useCallback((bookId, shelfId) => {
    setLibrary((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const has = b.shelves.includes(shelfId);
        return { ...b, shelves: has ? b.shelves.filter((s) => s !== shelfId) : [...b.shelves, shelfId] };
      })
    );
  }, [setLibrary]);
  const addGenre = useCallback((g) => {
    setGenres((prev) => [...new Set([...prev, g])].sort());
  }, [setGenres]);

  const addTrope = useCallback((t) => {
    setTropes((prev) => [...new Set([...prev, t])].sort());
  }, [setTropes]);
  const currentlyReading = library.filter((b) => b.status === 'reading' && !b.isArchived);
  const favorites        = library.filter((b) => b.isFavorite && !b.isArchived);
  const archived         = library.filter((b) => b.isArchived);
  const activeLibrary    = library.filter((b) => !b.isArchived);
  const yearStats = (() => {
    const year = new Date().getFullYear().toString();
    const finished = activeLibrary.filter((b) => {
      if (b.status !== 'finished') return false;
      if (b.reads.length > 0) return b.reads.some((r) => r.endDate?.startsWith(year));
      return b.dateAdded?.startsWith(year);
    });
    const pages = finished.reduce((sum, b) => sum + (b.pageCount || 0), 0);
    const topGenre = (() => {
      const counts = {};
      finished.forEach((b) => b.genres.forEach((g) => { counts[g] = (counts[g] || 0) + 1; }));
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    })();
    return { booksFinished: finished.length, pagesRead: pages, topGenre, goal: userProfile.readingGoal };
  })();

  return (
    <LibraryContext.Provider value={{
      library, shelves, userProfile, genres, tropes,
      currentlyReading, favorites, archived, activeLibrary, yearStats,
      updateProfile,
      addBook, updateBook, removeBook, toggleFavorite, archiveBook, isInLibrary,
      addRead, updateRead,
      addShelf, renameShelf, removeShelf, assignShelf,
      addGenre, addTrope,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}
