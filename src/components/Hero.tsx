import React from 'react';
import { Music } from 'lucide-react';
import {APP_CONSTANTS} from "../configs/constants.tsx";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)'
        }}
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
          Forró do Horizonte
        </h1>
        <a
          href={APP_CONSTANTS.SPOTIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full transition-all transform hover:scale-105"
        >
          <Music className="w-6 h-6" />
          Ouça no Spotify
        </a>
      </div>
    </div>
  );
};

export default Hero;