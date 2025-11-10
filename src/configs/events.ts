export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    previewImage: string;
    images: string[];
    driveFolderId?: string; // ID da pasta do Google Drive
    driveImageIds?: string[]; // IDs dos arquivos de imagem no Google Drive
    driveFolderLink?: string; // Link completo da pasta (opcional, para extrair o ID automaticamente)
}

// Função para gerar URL do Google Drive para visualizar imagem
// O Google Drive bloqueia acesso direto, então usamos um serviço de proxy
// Alternativamente, podemos usar o formato correto se os arquivos estiverem públicos
export const getGoogleDriveImageUrl = (fileId: string, size: 'thumbnail' | 'full' = 'full'): string => {
    // Usa um serviço de proxy público para acessar imagens do Google Drive
    // Isso contorna as restrições de CORS e acesso direto
    const proxyUrl = 'https://drive.google.com/uc?export=view&id=';
    
    if (size === 'thumbnail') {
        // Tenta formato de thumbnail primeiro (mais leve)
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000-h1000`;
    }
    
    // Para visualização completa, usa o formato de visualização
    // Se não funcionar, o onError nas imagens tentará alternativas
    return `${proxyUrl}${fileId}`;
};

// Função para extrair o ID da pasta do link do Google Drive
export const extractFolderIdFromLink = (link: string): string | undefined => {
    // Suporta diferentes formatos de link do Google Drive
    const patterns = [
        /\/folders\/([a-zA-Z0-9_-]+)/,  // https://drive.google.com/drive/folders/ID
        /id=([a-zA-Z0-9_-]+)/,          // https://drive.google.com/open?id=ID
    ];
    
    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return undefined;
};

// Função para buscar arquivos de uma pasta do Google Drive
// IMPORTANTE: Para usar esta função, você precisa de uma API Key do Google Drive
// 1. Acesse: https://console.cloud.google.com/
// 2. Crie um projeto ou selecione um existente
// 3. Ative a Google Drive API
// 4. Crie uma API Key em "Credenciais"
// 5. Adicione a API Key em uma variável de ambiente ou configure abaixo
// @ts-ignore - Vite define import.meta.env
const GOOGLE_DRIVE_API_KEY = (import.meta.env.VITE_GOOGLE_DRIVE_API_KEY as string) || '';

// Interface para armazenar informações do arquivo
interface DriveFile {
    id: string;
    name: string;
    webContentLink?: string;
    thumbnailLink?: string;
}

export const fetchDriveFolderFiles = async (folderId: string): Promise<DriveFile[]> => {
    if (!GOOGLE_DRIVE_API_KEY) {
        console.warn('Google Drive API Key não configurada. Configure VITE_GOOGLE_DRIVE_API_KEY no arquivo .env');
        return [];
    }

    try {
        const files: DriveFile[] = [];
        let pageToken: string | undefined = undefined;

        do {
            // Buscar arquivos na pasta usando a Google Drive API v3
            // Incluímos webContentLink e thumbnailLink para URLs diretas
            // Filtramos apenas imagens e removemos duplicatas
            const query = `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`;
            const fields = 'nextPageToken,files(id,name,mimeType,webContentLink,thumbnailLink)';
            const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&pageSize=1000${pageToken ? `&pageToken=${pageToken}` : ''}&key=${GOOGLE_DRIVE_API_KEY}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erro na resposta da API:', errorData);
                throw new Error(`Erro ao buscar arquivos: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.files && data.files.length > 0) {
                // Filtrar apenas arquivos de imagem válidos e remover duplicatas
                const imageFiles = data.files.filter((file: any) => {
                    const mimeType = file.mimeType || '';
                    const isImage = mimeType.startsWith('image/');
                    const isValidName = file.name && file.name.trim().length > 0;
                    return isImage && isValidName;
                });
                
                // Remover duplicatas baseado no ID do arquivo
                const uniqueFiles = imageFiles.filter((file: any, index: number, self: any[]) => 
                    index === self.findIndex((f: any) => f.id === file.id)
                );
                
                // Ordenar por nome para manter a ordem (Frame 1, Frame 2, etc.)
                const sortedFiles = uniqueFiles.sort((a: any, b: any) => {
                    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                });
                
                console.log(`Encontrados ${sortedFiles.length} arquivos únicos de imagem na pasta`);
                
                files.push(...sortedFiles.map((file: any) => {
                    console.log(`Arquivo: ${file.name} (ID: ${file.id})`);
                    return {
                        id: file.id,
                        name: file.name,
                        webContentLink: file.webContentLink,
                        thumbnailLink: file.thumbnailLink,
                    };
                }));
            } else {
                console.warn('Nenhum arquivo retornado pela API');
            }

            pageToken = data.nextPageToken;
        } while (pageToken);

        // Remover duplicatas finais (caso haja duplicatas entre páginas)
        const uniqueFiles = files.filter((file, index, self) => 
            index === self.findIndex(f => f.id === file.id)
        );

        // Ordenar novamente após remover duplicatas
        uniqueFiles.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });

        console.log(`Total de ${uniqueFiles.length} arquivos únicos encontrados após remoção de duplicatas`);
        
        return uniqueFiles;
    } catch (error) {
        console.error('Erro ao buscar arquivos do Google Drive:', error);
        return [];
    }
};

// Função para processar um evento e buscar automaticamente os IDs do Google Drive
export const processEventWithDriveFolder = async (event: Event): Promise<Event> => {
    // Se já tem driveImageIds, não precisa buscar novamente
    if (event.driveImageIds && event.driveImageIds.length > 0 && !event.driveImageIds[0].includes('PLACEHOLDER')) {
        return event;
    }

    // Extrair folderId do link ou usar o folderId fornecido
    let folderId = event.driveFolderId;
    
    if (!folderId && event.driveFolderLink) {
        folderId = extractFolderIdFromLink(event.driveFolderLink);
    }

    if (!folderId) {
        console.warn(`Evento "${event.title}" não tem driveFolderId ou driveFolderLink válido`);
        return event;
    }

    // Buscar arquivos da pasta
    const files = await fetchDriveFolderFiles(folderId);

    if (files.length === 0) {
        console.warn(`Nenhum arquivo encontrado na pasta do evento "${event.title}"`);
        return event;
    }

    // Gerar URLs para as imagens
    // IMPORTANTE: Para que funcione, os arquivos devem estar compartilhados como:
    // "Qualquer pessoa com o link pode visualizar"
    const imageUrls: string[] = [];
    const seenUrls = new Set<string>(); // Para evitar URLs duplicadas
    
    files.forEach(file => {
        let url: string | undefined = undefined;
        
        // Prioridade: webContentLink > thumbnailLink > formato gerado
        if (file.webContentLink) {
            // Remove parâmetros de download forçado e usa view
            url = file.webContentLink;
            url = url.replace('&export=download', '');
            url = url.replace('export=download', 'export=view');
            if (!url.includes('export=')) {
                url += (url.includes('?') ? '&' : '?') + 'export=view';
            }
        } else if (file.thumbnailLink) {
            // Aumenta o tamanho do thumbnail para melhor qualidade
            url = file.thumbnailLink.replace(/=s\d+/, '=s2000');
        } else {
            // Usa formato de visualização (mais confiável)
            url = getGoogleDriveImageUrl(file.id, 'full');
        }
        
        // Só adiciona se a URL não foi vista antes (evita duplicatas)
        if (url && !seenUrls.has(url)) {
            seenUrls.add(url);
            imageUrls.push(url);
            console.log(`Adicionando imagem: ${file.name} (ID: ${file.id})`);
        } else if (url && seenUrls.has(url)) {
            console.warn(`URL duplicada ignorada para: ${file.name} (ID: ${file.id})`);
        }
    });

    // Mapear fileIds para corresponder às URLs únicas
    const fileIds: string[] = [];
    const seenIds = new Set<string>();
    
    files.forEach(file => {
        let url: string | undefined = undefined;
        
        if (file.webContentLink) {
            url = file.webContentLink;
            url = url.replace('&export=download', '');
            url = url.replace('export=download', 'export=view');
            if (!url.includes('export=')) {
                url += (url.includes('?') ? '&' : '?') + 'export=view';
            }
        } else if (file.thumbnailLink) {
            url = file.thumbnailLink.replace(/=s\d+/, '=s2000');
        } else {
            url = getGoogleDriveImageUrl(file.id, 'full');
        }
        
        // Só adiciona o ID se a URL correspondente foi adicionada
        if (url && seenUrls.has(url) && !seenIds.has(file.id)) {
            seenIds.add(file.id);
            fileIds.push(file.id);
        }
    });
    
    // Mantém o previewImage original se já estiver definido e não for uma imagem padrão
    // Caso contrário, usa a primeira imagem do Google Drive se houver imagens válidas
    const hasCustomPreview = event.previewImage && 
        !event.previewImage.includes('/images/general/geral-01.png') &&
        !event.previewImage.includes('/images/share/banda-completa');
    
    const previewImage = hasCustomPreview 
        ? event.previewImage 
        : (imageUrls.length > 0 ? imageUrls[0] : (event.previewImage || ''));
    
    console.log(`Total de ${imageUrls.length} URLs únicas e ${fileIds.length} IDs únicos gerados`);

    // Atualizar o evento com os IDs e URLs encontrados
    const updatedEvent: Event = {
        ...event,
        driveFolderId: folderId,
        driveImageIds: fileIds,
        previewImage: previewImage,
        images: imageUrls,
    };

    return updatedEvent;
};

// Função para gerar slug do título (usado na URL)
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
};

// Dados dos eventos - você pode substituir por dados de uma API
// Agora você só precisa fornecer o driveFolderLink e os IDs serão buscados automaticamente!
export const eventsData: Event[] = [
    {
        id: '1',
        title: 'Aniversário de 1 ano Forró do Horizonte',
        description: 'Festa de comemoração de 1 ano de banda',
        date: '17 de Maio, 2025',
        location: 'Faiska, Uberlândia - MG',
        driveFolderLink: 'https://drive.google.com/drive/folders/1ABn_HMg9B3OzunBGxlNu19W96L_jAbe0',
        previewImage: '/images/events/cover/aniversario-1-ano.png', // Miniatura do evento (inserir manualmente na pasta public/images/events/cover/)
        images: [], // Será preenchido automaticamente
    },
    // Adicione mais eventos aqui - apenas forneça o driveFolderLink!
    // Exemplo:
    // {
    //     id: '2',
    //     title: 'Novo Evento',
    //     description: 'Descrição do evento',
    //     date: '01 de Janeiro, 2025',
    //     location: 'Local do evento',
    //     driveFolderLink: 'https://drive.google.com/drive/folders/SEU_FOLDER_ID_AQUI',
    //     previewImage: '/images/general/geral-01.png',
    //     images: [],
    // },
];

// Processar eventos e buscar IDs automaticamente
let processedEvents: Event[] = [];

export const initializeEvents = async (): Promise<Event[]> => {
    if (processedEvents.length > 0) {
        return processedEvents;
    }

    const promises = eventsData.map(event => processEventWithDriveFolder(event));
    processedEvents = await Promise.all(promises);
    
    return processedEvents;
};

// Exportar eventos (será atualizado após inicialização)
export let events: Event[] = eventsData;

// Inicializar eventos quando o módulo for carregado
initializeEvents().then(processed => {
    events = processed;
}).catch(error => {
    console.error('Erro ao inicializar eventos:', error);
    events = eventsData; // Fallback para dados originais
});
