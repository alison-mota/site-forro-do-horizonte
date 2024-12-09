import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, Download } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { usePlayerStore } from '../stores/playerStore';

const tracks = [
  {
    id: 1,
    title: "Ah, sabiá",
    artist: "Forró do Horizonte",
    duration: "3:06",
    file: "/public/audio/Ah-sabia.mp3"
  },
  {
    id: 2,
    title: "Cabe no Peito",
    artist: "Forró do Horizonte",
    duration: "3:41",
    file: "/public/audio/Cabe-no-peito.mpeg"
  },
  // Add more tracks as needed
];

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay, 
    setCurrentTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    setAudioRef
  } = usePlayerStore();

  useEffect(() => {
    // Set audio reference in store
    if (audioRef.current) {
      setAudioRef(audioRef);
      audioRef.current.volume = volume;
    }

    // Disable global player when entering this page
    const globalPlayer = document.querySelector('audio');
    if (globalPlayer) {
      globalPlayer.pause();
    }

    // Start with the first track if no track is selected
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleDownload = (track: typeof tracks[0]) => {
    const link = document.createElement('a');
    link.href = track.file;
    link.download = track.file.split('/').pop() || 'music.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const playNextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < tracks.length - 1) {
      setCurrentTrack(tracks[currentIndex + 1]);
    } else if (tracks.length > 0) {
      // Loop back to the first track
      setCurrentTrack(tracks[0]);
    }
  };

  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold text-center mb-16 text-white"
        >
          Nossas Músicas
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          {/* Player Interface */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 mb-8">
            {currentTrack && (
              <div className="text-white text-center mb-6">
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-white/80">{currentTrack.artist}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => {
                  const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
                  if (currentIndex > 0) {
                    setCurrentTrack(tracks[currentIndex - 1]);
                  }
                }}
                className="text-white hover:text-amber-400 transition-colors"
                disabled={!currentTrack || tracks.findIndex(t => t.id === currentTrack?.id) === 0}
              >
                <SkipBack className="w-8 h-8" />
              </button>

              <button
                onClick={togglePlay}
                className="bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>

              <button
                onClick={() => playNextTrack()}
                className="text-white hover:text-amber-400 transition-colors"
                disabled={!currentTrack || tracks.findIndex(t => t.id === currentTrack?.id) === tracks.length - 1}
              >
                <SkipForward className="w-8 h-8" />
              </button>

              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Playlist</h3>
              <div className="space-y-2">
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      currentTrack?.id === track.id
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'hover:bg-white/5 text-white'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <button
                      onClick={() => setCurrentTrack(track)}
                      className="flex-1 flex items-center gap-4"
                    >
                      <Music2 className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm opacity-80">{track.artist}</p>
                      </div>
                      <span className="text-sm opacity-80">{track.duration}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(track)}
                      className="text-white hover:text-amber-400 transition-colors p-2"
                      aria-label="Download track"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.file}
        onEnded={playNextTrack}
      />
    </PageBackground>
  );
};

export default Player;