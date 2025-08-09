import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import * as ChordMark from 'chord-mark';

declare module 'chord-mark' {
    interface ChordNode {
        chord: string;
        position: number;
    }
    interface LyricsLine {
        type: 'line';
        chords: ChordNode[];
        text: string;
    }
    interface SongSection {
        type: 'section';
        name: string;
        lines: LyricsLine[];
    }
    type ChordChart = Array<LyricsLine | SongSection>;
    export function parse(text: string): ChordChart;
    export function render(chordChart: ChordChart): string;
}

interface Song {
    id: string;
    title: string;
    artist: string;
    lyrics: string;
    chords: string;
    duration: string;
    videoUrl?: string;
}

const LyricsPage = () => {
    const [expandedSongId, setExpandedSongId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'lyrics' | 'chords'>('lyrics');

    const songs: Song[] = [
        {
            id: '1',
            title: 'Cabe no Peito',
            artist: 'Forró do Horizonte',
            duration: '3:41',
            lyrics: `Cê vai me desculpar,  
Mas meu amor não é  
Do tamanho do universo  
Ele cabe no peito  
Tem defeito, eu confesso  

Ele é meio sem jeito  
É cabrêro, é lerdo  
Mas também é ligeiro  
É faceiro, eu me apego  
Quando pego e me deito  

Ele é puro, ele é meigo  
Só misturo com fé e desejo  
Tem cheiro de afeto, tem gosto de beijo  

Tá no gesto, na pele  
Tá no verso, no apelo  

Meu amor cabe no peito  
Meu amor cabe no peito  
Meu amor cabe no peito  
Meu amor...`,
            chords: `E7M          E7      A7M  G#m7  
Cê vai me desculpar,    
F#m7       F#m/E   B7  C#m7  Ebm7(5-)  
Mas meu amor não é  

    B7           E7M  A7M C#m  C#m7/B  
Do tamanho do universo  
            Bbº  
Ele cabe no peito  

A      A/B           E7M  A7M C#m  C#m7/B  
Tem defeito, eu confesso  
               Bbº  
Ele é meio sem jeito  

A7M     Ab7     C#m7   D  
É cabrêro, é lerdo  
               A7M  
Mas também é ligeiro  
Ab7                C#m7    D  
É faceiro, eu me apego  
                  B   A  G#m F#m  
Quando pego e me deito  

A7M           A/B  
Ele é puro, ele é meigo  
A7M                  A/B  
Só misturo com fé e desejo  
A7M                      A/B  
Tem cheiro de afeto, tem gosto de beijo  

F#m7          G#m7  
Tá no gesto, na pele  
Cº              C#m  
Tá no verso, no apelo  

A     B                E  
Meu amor cabe no peito  
A     B                C#m7  
Meu amor cabe no peito  
A     B                E  
Meu amor cabe no peito  
A             B  
Meu amor…`,
            videoUrl: 'https://www.youtube.com/watch?v=5kNEu7EyDng&list=OLAK5uy_nYnl622xRZu7ZUEXi4KsaAPsicRtiuKkw&ab_channel=Forr%C3%B3DoHorizonte-Topic'
        },
        // Adicione mais músicas aqui...
    ];

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ChordDisplay = ({ chords }: { chords: string }) => {
        try {
            const parsed = ChordMark.parse(chords);
            const htmlOutput = ChordMark.render(parsed);
            return <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
        } catch (error) {
            return <div className="whitespace-pre-wrap">{chords}</div>;
        }
    };

    const toggleExpand = (songId: string) => {
        setExpandedSongId(expandedSongId === songId ? null : songId);
    };

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-16">
                <motion.h2
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="text-5xl font-bold text-center mb-8 text-white"
                >
                    Nossas Músicas
                </motion.h2>

                <div className="max-w-2xl mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Buscar música..."
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Playlist</h3>

                        {filteredSongs.length === 0 ? (
                            <p className="text-white/80 text-center py-4">Nenhuma música encontrada</p>
                        ) : (
                            <div className="space-y-2">
                                {filteredSongs.map((song) => (
                                    <div key={song.id} className="overflow-hidden">
                                        <motion.div
                                            className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                                                expandedSongId === song.id
                                                    ? 'bg-amber-500/20 text-amber-400'
                                                    : 'hover:bg-white/5 text-white'
                                            }`}
                                            onClick={() => toggleExpand(song.id)}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <Music2 className="flex-shrink-0 w-5 h-5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{song.title}</p>
                                                <p className="text-sm opacity-80 truncate">{song.artist}</p>
                                            </div>
                                            <span className="text-sm opacity-80 mr-2">{song.duration}</span>
                                            {expandedSongId === song.id ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </motion.div>

                                        {expandedSongId === song.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-4 pb-4"
                                            >
                                                <div className="flex border-b border-white/20 mb-4">
                                                    <button
                                                        className={`px-4 py-2 font-medium ${
                                                            activeTab === 'lyrics'
                                                                ? 'text-amber-400 border-b-2 border-amber-400'
                                                                : 'text-white/70 hover:text-white'
                                                        }`}
                                                        onClick={() => setActiveTab('lyrics')}
                                                    >
                                                        Letra
                                                    </button>
                                                    <button
                                                        className={`px-4 py-2 font-medium ${
                                                            activeTab === 'chords'
                                                                ? 'text-amber-400 border-b-2 border-amber-400'
                                                                : 'text-white/70 hover:text-white'
                                                        }`}
                                                        onClick={() => setActiveTab('chords')}
                                                    >
                                                        Cifra
                                                    </button>
                                                </div>

                                                <div className="bg-black/20 p-4 rounded-lg min-h-[200px]">
                                                    {activeTab === 'lyrics' ? (
                                                        <div className="text-white whitespace-pre-wrap">
                                                            {song.lyrics}
                                                        </div>
                                                    ) : (
                                                        <div className="font-mono text-white whitespace-pre-wrap">
                                                            <ChordDisplay chords={song.chords} />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageBackground>
    );
};

export default LyricsPage;