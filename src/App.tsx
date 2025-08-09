import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Player from './pages/Player';
import LyricsPage from "./pages/LyricsPage.tsx";

const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const redirectPath = sessionStorage.redirect;
        delete sessionStorage.redirect;

        if (redirectPath && redirectPath !== window.location.pathname) {
            navigate(redirectPath);
        }
    }, [navigate]);

    return null;
};

function App() {
    return (
        <Router>
            <div className="relative">
                <Navigation />
                <RedirectHandler />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/player" element={<Player />} />
                    <Route path="/letras" element={<LyricsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;