import React, { useState, useEffect } from 'react';
import { Menu, X, Music } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {APP_CONSTANTS} from '../configs/constants';
import MusicPlayer from './MusicPlayer';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/about', label: 'Quem Somos' },
    { path: '/booking', label: 'Contratantes' },
    { path: '/contact', label: 'Contato' },
    { path: '/player', label: 'Músicas Autorais' },
    { path: '/letras', label: 'Letras e Cifras' },
    { path: '/fotos-dos-eventos', label: 'Fotos dos Eventos' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md py-2 shadow-sm' : 'bg-black/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <motion.div
              className="flex flex-col md:flex-row items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white redcurrant-font">
                Forró do
              </span>
              <span className="text-[#FFC157] redcurrant-font">
                Horizonte
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            {location.pathname !== '/player' && <MusicPlayer />}

            <motion.button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md md:hidden"
              >
                <div className="p-4 space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block text-white hover:text-amber-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <a
                    href={APP_CONSTANTS.SPOTIFY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Music className="w-4 h-4" />
                    Spotify
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative text-white hover:text-amber-400 transition-colors"
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400"
                  />
                )}
              </Link>
            ))}
            <motion.a
              href={APP_CONSTANTS.SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Music className="w-4 h-4" />
              Spotify
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;