import React from 'react';
import { Download } from 'lucide-react';

const Booking = () => {
  return (
    <section className="py-20 bg-white" id="booking">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-amber-900">
          Área do Contratante
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <img
              src="https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80"
              alt="Forró do Horizonte em apresentação"
              className="rounded-lg shadow-xl w-full"
            />
            
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80"
                alt="Forró do Horizonte logo"
                className="h-32 object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-amber-900">
                Material para Download
              </h3>
              <div className="space-y-4">
                <a
                  href="/downloads/mapa-de-palco.pdf"
                  className="flex items-center gap-2 text-amber-900 hover:text-amber-700"
                >
                  <Download className="w-5 h-5" />
                  Mapa de Palco
                </a>
                <a
                  href="/downloads/release.pdf"
                  className="flex items-center gap-2 text-amber-900 hover:text-amber-700"
                >
                  <Download className="w-5 h-5" />
                  Release da Banda
                </a>
                <a
                  href="/downloads/rider-tecnico.pdf"
                  className="flex items-center gap-2 text-amber-900 hover:text-amber-700"
                >
                  <Download className="w-5 h-5" />
                  Rider Técnico
                </a>
              </div>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-amber-900">
                Contato para Shows
              </h3>
              <p className="text-lg text-amber-900">
                Entre em contato através do email:<br />
                <a href="mailto:contato@forrodohorizonte.com.br" className="text-amber-700 hover:underline">
                  contato@forrodohorizonte.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;