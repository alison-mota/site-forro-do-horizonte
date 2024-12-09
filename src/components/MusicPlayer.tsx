import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Download } from 'lucide-react';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackName, setTrackName] = useState('');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      
      // Extract track name from the source URL
      const sourceUrl = audioRef.current.querySelector('source')?.src;
      if (sourceUrl) {
        const fileName = sourceUrl.split('/').pop() || '';
        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
        const formattedName = nameWithoutExtension
          .split(/[-_]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        setTrackName(formattedName);
      }

      // Set up audio event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', handlePlay);
          audioRef.current.removeEventListener('pause', handlePause);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Playback failed:', error);
          });
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    const sourceUrl = audioRef.current?.querySelector('source')?.src;
    if (sourceUrl) {
      const link = document.createElement('a');
      link.href = sourceUrl;
      link.download = sourceUrl.split('/').pop() || 'music.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
      <audio ref={audioRef}>
        <source src="/audio/Ah-sabia.mp3" type="audio/mp3" />
      </audio>
      
      <button
        onClick={togglePlay}
        className="text-white hover:text-amber-400 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={toggleMute}
        className="text-white hover:text-amber-400 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {trackName && (
        <span className="text-white/80 text-sm whitespace-nowrap">
          {trackName}
        </span>
      )}

      <button
        onClick={handleDownload}
        className="text-white hover:text-amber-400 transition-colors ml-2"
        aria-label="Download"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MusicPlayer;