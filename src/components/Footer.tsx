import React from 'react';
import { Facebook, Instagram, Youtube, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-400">Forró do Horizonte</h3>
            <p className="text-amber-100/80">
              Levando a autenticidade do forró pé de serra para todo o Brasil.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-amber-100/80 hover:text-amber-100">Início</Link>
              </li>
              <li>
                <Link to="/about" className="text-amber-100/80 hover:text-amber-100">Quem Somos</Link>
              </li>
              <li>
                <Link to="/booking" className="text-amber-100/80 hover:text-amber-100">Contratantes</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-amber-100/80">contato@forrodohorizonte.com.br</li>
              <li className="text-amber-100/80">(XX) XXXX-XXXX</li>
              <li className="text-amber-100/80">Recife, PE</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-100/80 hover:text-amber-100 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-amber-100 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-amber-100 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-100/80 hover:text-amber-100 transition-colors">
                <Music className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-amber-100/60">
          <p>&copy; {new Date().getFullYear()} Forró do Horizonte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;