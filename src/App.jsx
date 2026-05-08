import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import { useLibrary } from './hooks/useLibrary';

import Nav         from './components/Nav';
import SetupScreen from './components/SetupScreen';

import Library    from './pages/Library';
import Search     from './pages/Search';
import Shelves    from './pages/Shelves';
import Favorites  from './pages/Favorites';
import Stats      from './pages/Stats';
import Settings   from './pages/Settings';
import SharedBook from './pages/SharedBook';
import NotFound   from './pages/NotFound';
function AppInner() {
  const { userProfile } = useLibrary();
  if (!userProfile.setupComplete) {
    return <SetupScreen />;
  }

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/"          element={<Library />}    />
        <Route path="/search"    element={<Search />}     />
        <Route path="/shelves"   element={<Shelves />}    />
        <Route path="/favorites" element={<Favorites />}  />
        <Route path="/stats"     element={<Stats />}      />
        <Route path="/settings"  element={<Settings />}   />
        <Route path="/shared"    element={<SharedBook />} />
        <Route path="*"          element={<NotFound />}   />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <AppInner />
      </LibraryProvider>
    </BrowserRouter>
  );
}
