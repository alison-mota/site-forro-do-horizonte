import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { generateSlug, Event } from '../configs/events';
import { useEvents } from '../hooks/useEvents';

// Função para converter data brasileira para Date
const parseDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
        'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
        'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
        'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    // Remove vírgulas e divide por " de "
    const cleaned = dateStr.toLowerCase().replace(/,/g, '');
    const parts = cleaned.split(' de ');
    if (parts.length === 3) {
        const day = parseInt(parts[0].trim());
        const month = months[parts[1].trim()];
        const year = parseInt(parts[2].trim());
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }
    return new Date(0); // Retorna data inválida se não conseguir parsear
};

// Ordenar eventos por data (mais recentes primeiro)
const sortEventsByDate = (eventsList: Event[]): Event[] => {
    return [...eventsList].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime(); // Mais recentes primeiro
    });
};

const EventPhotos = () => {
    const { events, isLoading } = useEvents();
    const sortedEvents = useMemo(() => sortEventsByDate(events), [events]);
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    // Função para tocar o player
    const playAudio = async () => {
        // Verifica se o usuário já pausou manualmente
        const userPaused = sessionStorage.getItem('userPausedMusic');
        if (userPaused === 'true') {
            return; // Não toca se o usuário já pausou
        }

        const audioElement = document.querySelector('audio') as HTMLAudioElement;
        if (audioElement && audioElement.paused) {
            try {
                await audioElement.play();
                setAudioUnlocked(true);
            } catch (error) {
                // Ignora erros de autoplay
            }
        }
    };

    // Toca o player automaticamente ao entrar na página
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;
        let intervalId: NodeJS.Timeout | null = null;
        let hasUnlocked = false;

        const getAudioElement = (): HTMLAudioElement | null => {
            return document.querySelector('audio') as HTMLAudioElement;
        };

        const attemptPlay = async (): Promise<boolean> => {
            // Verifica se o usuário já pausou manualmente
            const userPaused = sessionStorage.getItem('userPausedMusic');
            if (userPaused === 'true') {
                return false; // Não tenta tocar se o usuário já pausou
            }

            const audioElement = getAudioElement();
            
            if (!audioElement) {
                return false;
            }

            // Aguarda o elemento estar pronto
            if (audioElement.readyState < 2) {
                audioElement.load();
            }

            if (audioElement.paused) {
                try {
                    await audioElement.play();
                    setAudioUnlocked(true);
                    hasUnlocked = true;
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return false;
        };

        // Handler para desbloquear áudio na primeira interação
        const unlockAudio = async () => {
            if (hasUnlocked) return;
            
            const success = await attemptPlay();
            if (success) {
                // Remove todos os listeners após sucesso
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
                document.removeEventListener('mousemove', unlockAudio);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        };

        // Tenta encontrar e tocar imediatamente
        const tryImmediatePlay = async () => {
            const audioElement = getAudioElement();
            if (audioElement) {
                const success = await attemptPlay();
                if (success) {
                    return;
                }
            }

            // Se não conseguiu, tenta periodicamente
            attempts = 0;
            intervalId = setInterval(async () => {
                attempts++;
                const audioElement = getAudioElement();
                
                if (audioElement) {
                    const success = await attemptPlay();
                    if (success || attempts >= maxAttempts) {
                        if (intervalId) {
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    }
                } else if (attempts >= maxAttempts) {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }
            }, 200);
        };

        // Inicia tentativas
        tryImmediatePlay();

        // Adiciona listeners para qualquer interação (desbloqueia autoplay)
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
        document.addEventListener('mousemove', unlockAudio, { once: true });

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            document.removeEventListener('mousemove', unlockAudio);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return (
        <PageBackground>
            <div className="container mx-auto px-4 pt-8 pb-16">
                {isLoading && (
                    <div className="text-center py-16">
                        <p className="text-white/80 text-lg">Carregando eventos...</p>
                    </div>
                )}

                {!isLoading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {sortedEvents.map((event, index) => (
                        <Link
                            key={event.id}
                            to={`/${generateSlug(event.title)}`}
                            className="block h-full"
                            onClick={playAudio}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow h-full flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden flex-shrink-0 bg-gray-800">
                                    <img
                                        src={event.previewImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            // Se a imagem não carregar, oculta o elemento
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            console.warn(`Não foi possível carregar preview do evento "${event.title}"`);
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-semibold mb-3 text-amber-200 group-hover:text-amber-100 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-4 line-clamp-3 flex-grow">
                                        {event.description}
                                    </p>
                                    <div className="space-y-2 text-sm text-white/70 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
                )}

                {!isLoading && sortedEvents.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-white/80 text-lg">Nenhum evento cadastrado ainda.</p>
                    </div>
                )}
            </div>
        </PageBackground>
    );
};

export default EventPhotos;

