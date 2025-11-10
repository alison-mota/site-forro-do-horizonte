import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Download, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { generateSlug } from '../configs/events';
import { useEvents } from '../hooks/useEvents';

const EventDetail = () => {
    const { eventSlug } = useParams<{ eventSlug: string }>();
    const { events, isLoading } = useEvents();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visibleImages, setVisibleImages] = useState<string[]>([]);
    const [loadedCount, setLoadedCount] = useState(10);
    const [validImages, setValidImages] = useState<string[]>([]); // Apenas imagens que carregaram com sucesso
    const [imageToFileIdMap, setImageToFileIdMap] = useState<{ [url: string]: string }>({}); // Mapeamento URL -> fileId
    const [isPreloading, setIsPreloading] = useState(true); // Estado de pré-carregamento
    const [preloadProgress, setPreloadProgress] = useState({ current: 0, total: 0 }); // Progresso do pré-carregamento
    const observerRef = useRef<HTMLDivElement>(null);
    const IMAGES_PER_PAGE = 10;

    // Encontrar o evento pelo slug
    const event = events.find(e => generateSlug(e.title) === eventSlug);

    // Pré-carregar imagens quando o evento mudar
    useEffect(() => {
        if (event && event.images && event.images.length > 0) {
            // Filtra apenas imagens válidas (não vazias e não são imagens padrão do projeto)
            // Mantém o índice original para mapear com driveImageIds
            const filteredImages = event.images
                .map((img, index) => ({ url: img, originalIndex: index }))
                .filter(({ url }) => 
                    url && 
                    url.trim() !== '' && 
                    !url.includes('/images/general/geral-01.png') &&
                    !url.includes('/images/share/banda-completa')
                );
            
            if (filteredImages.length === 0) {
                setValidImages([]);
                setVisibleImages([]);
                setLoadedCount(0);
                setIsPreloading(false);
                return;
            }
            
            setIsPreloading(true);
            setPreloadProgress({ current: 0, total: filteredImages.length });
            
            // Pré-carrega imagens em lotes de 10, mostrando progresso
            const imageUrls = filteredImages.map(item => item.url);
            const indexMap = filteredImages.map(item => item.originalIndex);
            const batchSize = 10;
            let allValidUrls: string[] = [];
            
            const validateBatch = async (startIndex: number): Promise<{ url: string; fileId?: string }[]> => {
                const batch = imageUrls.slice(startIndex, startIndex + batchSize);
                
                const promises = batch.map((url, batchIndex) => {
                    return new Promise<{ url: string | null; fileId?: string }>((resolve) => {
                        const originalIndex = indexMap[startIndex + batchIndex];
                        const fileId = event?.driveImageIds?.[originalIndex];
                        
                        const img = new Image();
                        img.onload = () => resolve({ url, fileId });
                        img.onerror = () => {
                            if (fileId) {
                                const altFormats = [
                                    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
                                    `https://drive.google.com/uc?export=download&id=${fileId}`,
                                ];
                                
                                let formatIndex = 0;
                                const tryNextFormat = () => {
                                    if (formatIndex >= altFormats.length) {
                                        resolve({ url: null });
                                        return;
                                    }
                                    
                                    const altImg = new Image();
                                    altImg.onload = () => resolve({ url: altFormats[formatIndex], fileId });
                                    altImg.onerror = () => {
                                        formatIndex++;
                                        tryNextFormat();
                                    };
                                    altImg.src = altFormats[formatIndex];
                                };
                                
                                tryNextFormat();
                            } else {
                                resolve({ url: null });
                            }
                        };
                        img.src = url;
                    });
                });
                
                const results = await Promise.all(promises);
                return results
                    .filter((result): result is { url: string; fileId?: string } => result.url !== null)
                    .map(result => ({ url: result.url!, fileId: result.fileId }));
            };
            
            // Valida e exibe em lotes progressivamente
            const processBatches = async () => {
                const urlToFileId: { [url: string]: string } = {};
                
                // Primeiro lote: valida e mostra imediatamente
                const firstBatch = await validateBatch(0);
                const firstBatchUrls = firstBatch.map(result => result.url);
                allValidUrls = [...firstBatchUrls];
                
                // Mapeia URLs para fileIds do primeiro lote
                firstBatch.forEach((result) => {
                    if (result.fileId) {
                        urlToFileId[result.url] = result.fileId;
                    }
                });
                
                setValidImages([...allValidUrls]);
                setImageToFileIdMap(urlToFileId);
                setVisibleImages(allValidUrls.slice(0, IMAGES_PER_PAGE));
                setLoadedCount(Math.min(IMAGES_PER_PAGE, allValidUrls.length));
                setPreloadProgress({ current: batchSize, total: imageUrls.length });
                
                // Esconde o loading e mostra os primeiros quadros
                setIsPreloading(false);
                
                // Continua validando os próximos lotes em background
                for (let i = batchSize; i < imageUrls.length; i += batchSize) {
                    const validBatch = await validateBatch(i);
                    const batchUrls = validBatch.map(result => result.url);
                    allValidUrls = [...allValidUrls, ...batchUrls];
                    
                    // Mapeia URLs para fileIds do lote atual
                    validBatch.forEach((result) => {
                        if (result.fileId) {
                            urlToFileId[result.url] = result.fileId;
                        }
                    });
                    
                    // Atualiza o estado com as imagens válidas até agora
                    setValidImages([...allValidUrls]);
                    setImageToFileIdMap({ ...urlToFileId });
                    
                    // Atualiza progresso (sem mostrar loading novamente)
                    const processed = Math.min(i + batchSize, imageUrls.length);
                    setPreloadProgress({ current: processed, total: imageUrls.length });
                    
                    // Pequeno delay para não sobrecarregar
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            };
            
            processBatches();
        } else {
            setValidImages([]);
            setVisibleImages([]);
            setLoadedCount(0);
            setIsPreloading(false);
        }
    }, [event]);

    // Observer para carregar mais imagens ao fazer scroll
    useEffect(() => {
        if (!event || !observerRef.current || validImages.length === 0 || isPreloading) return;
        
        if (loadedCount >= validImages.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && loadedCount < validImages.length) {
                    const nextBatch = validImages.slice(loadedCount, loadedCount + IMAGES_PER_PAGE);
                    setVisibleImages((prev) => {
                        const newImages = [...prev, ...nextBatch];
                        // Remove duplicatas
                        return [...new Set(newImages)];
                    });
                    setLoadedCount((prev) => Math.min(prev + IMAGES_PER_PAGE, validImages.length));
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = observerRef.current;
        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [event, loadedCount, IMAGES_PER_PAGE, validImages, isPreloading]);

    if (isLoading) {
        return (
            <PageBackground>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Carregando evento...</h2>
                </div>
            </PageBackground>
        );
    }

    if (!event) {
        return (
            <PageBackground>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Evento não encontrado</h2>
                    <Link to="/fotos-dos-eventos" className="text-amber-400 hover:text-amber-300">
                        Voltar para Fotos
                    </Link>
                </div>
            </PageBackground>
        );
    }

    const handleDownload = async (imageUrl: string) => {
        // Tenta obter o fileId do Google Drive para a imagem
        const fileId = imageToFileIdMap[imageUrl];
        
        if (fileId) {
            // Para Google Drive, usa a URL de download direto
            // O Google Drive pode redirecionar, então precisamos seguir o redirecionamento
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            try {
                // Tenta fazer fetch da URL de download
                const response = await fetch(downloadUrl, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                    redirect: 'follow'
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    
                    // Verifica se o blob não é uma página HTML (que indica erro do Google Drive)
                    if (blob.type.startsWith('text/html')) {
                        throw new Error('Google Drive retornou HTML ao invés da imagem');
                    }
                    
                    const blobUrl = window.URL.createObjectURL(blob);
                    
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `foto-${Date.now()}.jpg`;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    
                    // Limpa após um tempo
                    setTimeout(() => {
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                    }, 100);
                } else {
                    throw new Error('Resposta não OK');
                }
            } catch (error) {
                // Método alternativo: cria um link que aponta diretamente para a URL de download
                // Isso força o navegador a fazer o download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `foto-${Date.now()}.jpg`;
                link.target = '_self';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                
                // Remove o link após um tempo
                setTimeout(() => {
                    if (document.body.contains(link)) {
                        document.body.removeChild(link);
                    }
                }, 1000);
            }
        } else {
            // Se não tiver fileId, tenta fazer download via fetch da URL da imagem
            try {
                const response = await fetch(imageUrl, {
                    mode: 'cors',
                    credentials: 'omit',
                    referrerPolicy: 'no-referrer'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao baixar imagem');
                }
                
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `foto-${Date.now()}.jpg`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 100);
            } catch (error) {
                console.error('Erro ao baixar imagem:', error);
                // Último recurso: abre em nova aba
                window.open(imageUrl, '_blank');
            }
        }
    };

    const openImage = (imageUrl: string, index: number) => {
        // Encontrar o índice real no array de imagens válidas
        const realIndex = validImages.indexOf(imageUrl);
        setSelectedImage(imageUrl);
        setCurrentImageIndex(realIndex);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        if (validImages.length === 0) return;
        const nextIndex = (currentImageIndex + 1) % validImages.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(validImages[nextIndex]);
    };

    const prevImage = () => {
        if (validImages.length === 0) return;
        const prevIndex = (currentImageIndex - 1 + validImages.length) % validImages.length;
        setCurrentImageIndex(prevIndex);
        setSelectedImage(validImages[prevIndex]);
    };

    return (
        <PageBackground>
            <div className="container mx-auto px-4 pt-8 pb-16">
                {/* Botão voltar */}
                <Link
                    to="/fotos-dos-eventos"
                    className="inline-flex items-center gap-2 text-white hover:text-amber-400 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar para Fotos
                </Link>

                {/* Informações do evento */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-amber-200">
                        {event.title}
                    </h1>
                    <p className="text-white/80 mb-6 leading-relaxed text-lg">
                        {event.description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-white/70">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">{event.location}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Loading durante pré-carregamento */}
                {isPreloading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16"
                    >
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-400 mb-4"></div>
                        <p className="text-white/80 text-lg font-semibold">Carregando e validando imagens...</p>
                        {preloadProgress.total > 0 && (
                            <p className="text-white/60 text-sm mt-2">
                                {preloadProgress.current} de {preloadProgress.total} imagens verificadas
                            </p>
                        )}
                        <p className="text-white/50 text-xs mt-1">Validando em lotes de 10...</p>
                    </motion.div>
                )}

                {/* Galeria de fotos */}
                {!isPreloading && (
                    <>
                        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {visibleImages.map((image, index) => {
                                const realIndex = validImages.indexOf(image);
                                // Usa o índice do array como chave única, com fallback para a URL
                                const uniqueKey = realIndex >= 0 ? `img-${realIndex}` : `img-url-${index}-${image.substring(0, 20)}`;
                                return (
                                    <motion.div
                                        key={uniqueKey}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (index % IMAGES_PER_PAGE) * 0.05 }}
                                        className="relative group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 cursor-pointer hover:shadow-xl transition-shadow"
                                        onClick={() => openImage(image, realIndex)}
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-gray-800">
                                            <img
                                                src={image}
                                                alt={`${event.title} - Foto ${realIndex + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Se chegou aqui, significa que a imagem falhou mesmo após pré-carregamento
                                                    // Isso não deveria acontecer, mas se acontecer, oculta o quadro
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    console.warn(`Imagem ${realIndex + 1} falhou após pré-carregamento - ocultando quadro`);
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Elemento observador para carregar mais imagens */}
                        {loadedCount < validImages.length && (
                            <div ref={observerRef} className="h-20 flex items-center justify-center">
                                <div className="text-white/60 text-sm">Carregando mais fotos...</div>
                            </div>
                        )}

                        {validImages.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-white/80 text-lg">Nenhuma foto válida encontrada para este evento.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal para ampliar foto */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                        onClick={closeImage}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-6xl w-full max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botão fechar */}
                            <button
                                onClick={closeImage}
                                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Botão anterior */}
                            {validImages.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            {/* Botão próximo */}
                            {validImages.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}

                            {/* Imagem ampliada */}
                            <img
                                src={selectedImage}
                                alt={`${event.title} - Foto ampliada`}
                                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                            />

                            {/* Botão download na parte inferior */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(selectedImage);
                                    }}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-full transition-colors shadow-lg"
                                >
                                    <Download className="w-5 h-5" />
                                    Baixar Foto
                                </button>
                            </div>

                            {/* Indicador de foto atual */}
                            {validImages.length > 1 && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                                    {currentImageIndex + 1} / {validImages.length}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageBackground>
    );
};

export default EventDetail;

