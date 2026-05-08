# 📚 Spine — Your Reading Life, Organized.

A personal library web app built with React. Track every book you own or want to read, organize them into custom shelves, rate and review privately, and watch your annual reading stats come to life.

---

## ✨ Features

- **Search & Add Books** — Find books via the Open Library API and add them to your library in one click
- **Reading Status Tracking** — Mark books as Want to Read, Currently Reading, Finished, Paused, or Did Not Finish — changeable directly from the library list without opening a book card
- **Book Card Details** — Track format (physical / eBook / audiobook), platform (Kindle, Libby, Hoopla, etc.), current page, total pages, genres, tropes, publisher, and more
- **Reading Log** — Log start and end dates for every read (including re-reads), which powers your annual stats
- **Rating System** — Rate books from 1–5 in 0.25 increments with gold star display
- **Favorites** — Heart any book to add it to your Favorites page
- **Custom Shelves** — Create named shelves (e.g. "May TBR", "Rom Com Faves") with a visual bookshelf display showing book covers
- **Notes** — Add private notes to any book; optionally make them public when sharing
- **Book Sharing** — Share any book (with optional notes) via a generated URL — no account needed for the recipient
- **Annual Reading Stats** — See books finished, pages read, top genre, goal progress, and highest-rated books. Download as an image to share.
- **Reading Goal** — Set an annual reading intention tracked as a progress bar
- **Dark Mode** — Toggle between light and dark
- **Two Themes** — Rose (warm/soft) or Slate (cool/editorial) — chosen at setup
- **Export / Import** — Download your full library as JSON; re-import on any device
- **Onboarding** — 3-step setup screen on first launch

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (via Vite) |
| Routing | React Router DOM v6 |
| State | Context API + custom hooks |
| Persistence | `localStorage` via custom `useLocalStorage` hook |
| Book Search | Open Library API (free, no key required) |
| Share Cards | `html2canvas` |
| Fonts | Google Fonts — Fraunces (heading) + Inter (body) |
| Styling | Custom CSS with design tokens (CSS custom properties) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BookCard.jsx              # List card with inline status dropdown
│   ├── CurrentlyReadingHero.jsx  # Horizontal hero cards with progress ring
│   ├── FilterBar.jsx             # Status / genre / shelf filters + sort
│   ├── LibraryCardModal.jsx      # Full book editing modal (3 tabs)
│   ├── LoadingScreen.jsx         # Spinner + random literary quote
│   ├── Nav.jsx                   # Fixed top nav with dark mode toggle
│   ├── RatingPicker.jsx          # 0.25-increment rating selector
│   └── SetupScreen.jsx           # First-launch onboarding (3 steps)
├── context/
│   └── LibraryContext.jsx        # Global state, CRUD, computed views, stats
├── data/
│   ├── genres.js                 # Default genres, platforms, reading statuses
│   ├── quotes.js                 # Literary quotes for loading screen
│   └── tropes.js                 # Default reading tropes
├── hooks/
│   ├── useAPI.js                 # Open Library search hook
│   ├── useLibrary.js             # Consumes LibraryContext
│   └── useLocalStorage.js        # Synced localStorage state hook
├── pages/
│   ├── Favorites.jsx             # Filtered favorites list
│   ├── Library.jsx               # Homepage: stats hero + collection list
│   ├── NotFound.jsx              # 404 page
│   ├── Search.jsx                # Book search + add to library
│   ├── Settings.jsx              # Profile, theme, dark mode, export/import
│   ├── SharedBook.jsx            # Public book view via URL share
│   ├── Shelves.jsx               # Visual bookshelf with book-picker panel
│   └── Stats.jsx                 # Annual reading recap + shareable image
├── styles/
│   ├── global.css                # Design system: reset, components, utilities
│   └── tokens.css                # CSS custom properties for all 4 themes
├── utils/
│   └── helpers.js                # uid, dates, ratings, purchase links, export, share
├── App.jsx                       # Router + provider setup
└── main.jsx                      # Entry point
```

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/DestiniCodes/project-3-spine.git
cd project-3-spine

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 💡 Key JavaScript Concepts Used

- **React Context API** — Global state shared across all components without prop drilling
- **Custom Hooks** — `useLocalStorage`, `useLibrary`, `useAPI` encapsulate reusable logic
- **useMemo** — Filtered/sorted book list only recalculates when dependencies change
- **useEffect** — Syncs localStorage on state change; applies theme to `<html>` element
- **localStorage** — Full persistence without a backend (JSON serialize/deserialize)
- **React Router DOM** — Client-side routing with 8 pages + 404 + shared book route
- **Fetch API** — Async calls to Open Library search endpoint
- **btoa / atob** — Encodes book data into a shareable URL parameter
- **html2canvas** — Screenshots the stats card DOM node for social sharing
- **CSS Custom Properties** — Four complete themes (Rose light/dark, Slate light/dark) via `data-theme` and `data-mode` attributes on `<html>`

---

## 🌐 API

**Open Library** — `https://openlibrary.org/search.json`
- Free, no API key required
- No rate limits for reasonable personal use
- Returns title, author, cover image, ISBN, publisher, page count, and genres

---

## 📝 Notes

- All data is stored in your browser's `localStorage` — nothing leaves your device
- Use **Settings → Export Library** to back up your data as a JSON file
- Use **Settings → Import Library** to restore on a new browser or device
- Dark mode and theme preference are also persisted between sessions

---

*Built as Major Project 3 for a coding bootcamp. Designed for personal use — a quiet, private reading life tracker.*
