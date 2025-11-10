import { useState, useEffect } from 'react';
import { initializeEvents, Event } from '../configs/events';

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                const loadedEvents = await initializeEvents();
                setEvents(loadedEvents);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar eventos:', err);
                setError('Erro ao carregar eventos do Google Drive');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    return { events, isLoading, error };
};

