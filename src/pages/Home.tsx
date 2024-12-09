import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Music, ArrowDown } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const Home = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <PageBackground>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="min-h-screen flex items-center justify-center -mt-20"
      >
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center"
            >
              <img 
                src="/images/logo.png"
                alt="Forró do Horizonte"
                className="w-[500px] h-auto"
              />
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl text-amber-200 font-light">
              O autêntico forró pé de serra
            </h2>
            
            <motion.div 
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://open.spotify.com/artist/your-artist-id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <Music className="w-6 h-6 group-hover:animate-spin" />
                Ouça no Spotify
              </a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8" />
        </motion.div>
      </motion.section>

      {/* Featured Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            {[
              {
                title: "Tradição",
                description: "Mais de uma década levando o autêntico forró pé de serra",
                image: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&q=80"
              },
              {
                title: "Qualidade",
                description: "Músicos profissionais e equipamentos de primeira linha",
                image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80"
              },
              {
                title: "Energia",
                description: "Shows envolventes que contagiam o público do início ao fim",
                image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl aspect-square"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <img 
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-amber-200">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageBackground>
  );
};

export default Home;