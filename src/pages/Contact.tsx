import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Calendar, Music } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const Contact = () => {
  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold text-center mb-16 text-white"
        >
          Contato
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                Informações de Contato
              </h3>
              <div className="space-y-6">
                <a 
                  href="mailto:contato@forrodohorizonte.com.br" 
                  className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors group"
                >
                  <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-amber-100/80">contato@forrodohorizonte.com.br</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-6 h-6" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-amber-100/80">(XX) XXXX-XXXX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-white">
                  <MapPin className="w-6 h-6" />
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-amber-100/80">Recife, Pernambuco</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <Clock className="w-6 h-6" />
                  <div>
                    <p className="font-medium">Horário de Atendimento</p>
                    <p className="text-amber-100/80">Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                Agenda de Shows
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <Calendar className="w-6 h-6" />
                  <p>Consulte nossa agenda de shows</p>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Music className="w-6 h-6" />
                  <p>Disponível para eventos privados</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="space-y-8"
          >
            <form className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-amber-200">
                Envie sua Mensagem
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Nome</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white mb-2">Assunto</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Enviar Mensagem
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageBackground>
  );
};

export default Contact;