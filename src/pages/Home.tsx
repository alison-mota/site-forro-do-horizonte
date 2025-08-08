import React from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowDown } from 'lucide-react';
import { APP_CONSTANTS } from '../configs/constants';
import PageBackground from '../components/PageBackground';

const Home = () => {
    return (
        <PageBackground>
            <section className="min-h-screen flex items-center justify-center -mt-20">
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
                            Isso é Brasil profundo, sul da América pro mundo!
                        </h2>

                        <motion.div
                            className="flex flex-col md:flex-row gap-6 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <a
                                href={APP_CONSTANTS.SPOTIFY_URL}
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
            </section>
        </PageBackground>
    );
};

export default Home;