import { useMemo } from 'react';
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

    const cleaned = (dateStr || '').toLowerCase().trim();

    // Formatos suportados:
    // - "17 de Maio, 2025"
    // - "17 de Maio de 2025"
    // - "17/05/2025" ou "17-05-2025"
    const m1 = cleaned.match(/^(\d{1,2})\s+de\s+([a-zçãõáéíóú]+)\s*,?\s*(?:de\s*)?(\d{4})$/i);
    if (m1) {
        const day = parseInt(m1[1], 10);
        const month = months[m1[2].trim()];
        const year = parseInt(m1[3], 10);
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }

    const m2 = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (m2) {
        const day = parseInt(m2[1], 10);
        const month = parseInt(m2[2], 10) - 1;
        const year = parseInt(m2[3], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }

    return new Date(0); // Fallback (data inválida)
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

