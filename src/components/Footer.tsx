import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/80 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Logo & Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-amber-400">Forró do Horizonte</h3>
            <p className="text-sm text-amber-100/80">
              Levando o forró pé de serra para todo o Brasil.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-amber-200 mb-2">Contato</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-amber-100/80">forrodohorizonte@gmail.com</li>
              <li>
                <a 
                  href="https://wa.me/5564981206193" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors"
                >
                  (64) 98120-6193
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5534999023439" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors"
                >
                  (34) 99902-3439
                </a>
              </li>
              <li className="text-amber-100/80">Uberlândia, MG</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-base font-semibold text-amber-200 mb-2">Redes Sociais</h4>
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/forrodohorizonte/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-100/80 hover:text-amber-100 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                  href="https://www.youtube.com/watch?v=5kNEu7EyDng&list=OLAK5uy_nYnl622xRZu7ZUEXi4KsaAPsicRtiuKkw&ab_channel=Forr%C3%B3DoHorizonte-Topic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-100/80 hover:text-amber-100 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-amber-100/60">
          <p>&copy; {new Date().getFullYear()} Forró do Horizonte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;