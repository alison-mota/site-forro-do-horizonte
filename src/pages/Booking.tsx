import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Phone, MapPin } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import PhotoGallery from '../components/PhotoGallery';

const downloadFiles = [
  { 
    name: 'Mapa de Palco e Rider Técnico',
    filename: 'mapa-de-palco.pdf',
    path: '/downloads/mapa-de-palco.pdf'
  }
];

const Booking = () => {
  const handleDownload = (file: typeof downloadFiles[0]) => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageBackground>
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                Material para Download
              </h3>
              <div className="space-y-4">
                {downloadFiles.map((file, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleDownload(file)}
                    className="flex items-center gap-3 text-white hover:text-amber-200 bg-white/5 p-4 rounded-lg transition-all hover:bg-white/10 w-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Download className="w-5 h-5" />
                    {file.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                Contato
              </h3>
              <div className="space-y-4">
                <a href="mailto:forrodohorizonte@gmail.com" className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors">
                  <Mail className="w-5 h-5" />
                  forrodohorizonte@gmail.com
                </a>
                <div className="space-y-2">
                  <a 
                    href="https://wa.me/5564981206193" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    (64) 98120-6193
                  </a>
                  <a 
                    href="https://wa.me/5534999023439" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    (34) 99902-3439
                  </a>
                </div>
                <p className="flex items-center gap-3 text-white">
                  <MapPin className="w-5 h-5" />
                  Uberlândia, MG
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="space-y-8"
          >
            <PhotoGallery />
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-4 text-amber-200">
                Estrutura do Show
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white">
                <li>Duração: 2 horas de show</li>
                <li>Equipe: 4 músicos profissionais</li>
                <li>Repertório original com autorais e outros sucessos</li>
                <li>Equipamento de som próprio (opcional)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </PageBackground>
  );
};

export default Booking;