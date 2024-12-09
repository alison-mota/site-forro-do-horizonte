import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';

interface PageBackgroundProps {
  children: React.ReactNode;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 pt-20 min-h-screen flex flex-col"
      >
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default PageBackground;