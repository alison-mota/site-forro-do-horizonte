import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

const photos = [
    {
        thumbnail: "/images/share/banda-completa-01-mini.png",
        full: "/images/share/banda-completa-01.png",
        description: "Formação completa da banda"
    },
    {
        thumbnail: "/images/share/trio-01-mini.png",
        full: "/images/share/trio-01.png",
        description: "Formação Trio"
    },
    {
        thumbnail: "/images/share/logo-mini.png",
        full: "/images/logo.png",
        description: "Logo"
    }
];

const PhotoGallery = () => {
    const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

    const handleDownload = () => {
        if (!selectedPhoto) return;

        const link = document.createElement('a');
        link.href = selectedPhoto.full;
        link.download = selectedPhoto.full.split('/').pop() || 'forro-do-horizonte.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
                <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                    Fotos para Divulgação
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <img
                                src={photo.thumbnail}
                                alt={photo.description}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-sm text-center px-2">
                                    {photo.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            className="relative max-w-4xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhoto(null);
                                }}
                                className="absolute -top-12 right-0 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <img
                                src={selectedPhoto.full}
                                alt=""
                                className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain"
                            />

                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload();
                                    }}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Baixar Imagem</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PhotoGallery;