import { Link, Route, Routes } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import "./App.css";

function App() {
  return (
    <>
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="brand">
            Pokémon Explorer
          </Link>

          <nav className="nav-links">
            <Link to="/">List</Link>
            <Link to="/gallery">Gallery</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      </Routes>
    </>
  );
}

export default App;
