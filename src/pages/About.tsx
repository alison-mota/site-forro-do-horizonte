import React from 'react';
import { motion } from 'framer-motion';
import PageBackground from '../components/PageBackground';

const About = () => {
  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold text-center mb-16 text-white"
        >
          Quem Somos
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="space-y-6 text-lg text-amber-100"
          >
            <p className="text-xl leading-relaxed">
              Nascidos da paixão pela cultura nordestina, o Forró do Horizonte traz em sua 
              essência a autenticidade do forró pé de serra, mesclando tradição e modernidade 
              em cada apresentação.
            </p>
            <p className="text-xl leading-relaxed">
              Com mais de uma década de estrada, nossa banda tem levado a alegria e a energia 
              contagiante do forró para os mais diversos palcos do Brasil.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-video">
              <img
                src="https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&q=80"
                alt="Músicos tocando"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </PageBackground>
  );
};

export default About;