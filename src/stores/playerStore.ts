import { create } from 'zustand';
import { RefObject } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

interface PlayerStore {
  isPlaying: boolean;
  currentTrack: Track | null;
  audioRef: RefObject<HTMLAudioElement> | null;
  volume: number;
  isMuted: boolean;
  setAudioRef: (ref: RefObject<HTMLAudioElement>) => void;
  togglePlay: () => void;
  setCurrentTrack: (track: Track) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  audioRef: null,
  volume: 0.5,
  isMuted: false,
  setAudioRef: (ref) => set({ audioRef: ref }),
  togglePlay: () => {
    const { isPlaying, audioRef } = get();
    if (audioRef?.current) {
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
      set({ isPlaying: !isPlaying });
    }
  },
  setCurrentTrack: (track) => {
    set({ currentTrack: track });
    const { audioRef } = get();
    if (audioRef?.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback failed:', error);
        });
      }
      set({ isPlaying: true });
    }
  },
  setVolume: (volume) => {
    set({ volume });
    const { audioRef, isMuted } = get();
    if (audioRef?.current && !isMuted) {
      audioRef.current.volume = volume;
    }
  },
  toggleMute: () => {
    const { isMuted, audioRef, volume } = get();
    if (audioRef?.current) {
      audioRef.current.volume = isMuted ? volume : 0;
      set({ isMuted: !isMuted });
    }
  },
}));