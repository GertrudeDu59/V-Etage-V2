import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './home';
import Playlist from './playlist';
import NavBar from './components/navbar';
import Footer from './components/footer';
import PlaylistObs from './PlaylistObs';

function AppWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === '/playlist-obs';

  return (
    <>
      {!hideLayout && <NavBar />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/playlist-obs" element={<PlaylistObs />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
