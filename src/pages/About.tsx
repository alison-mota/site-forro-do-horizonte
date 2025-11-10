import React from 'react';
import { motion } from 'framer-motion';
import PageBackground from '../components/PageBackground';

const About = () => {
    return (
        <PageBackground>
            <div className="container mx-auto px-4 pt-8 pb-16">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
                    <motion.div
                        initial={{ x: -50 }}
                        animate={{ x: 0 }}
                        className="space-y-6 text-lg text-amber-100 flex flex-col justify-center"
                    >
                        <p className="text-xl leading-relaxed">
                            A banda FORRÓ DO HORIZONTE é uma banda de forró pé de serra autoral que traz referências goianas,
                            mineiras e da cultura nordestina. A banda procura sempre trabalhar em seus shows ao vivo suas
                            músicas autorais, além de interpretar músicas de outros artistas do gênero,
                            como Dominguinhos, Luiz Gonzaga, Dió de Araújo, Trio Dona Zefa, Trio Nordestino, Os 3 do Nordeste,
                            Flávio José, Marinês, Gilberto Gil, Oswaldinho do Acordeon, Sivuca, entre outros.
                        </p>
                        <p className="text-xl leading-relaxed">
                            Uma das principais preocupações da banda é com seu público dançante, tanto em relação ao espaço dos
                            locais dos shows quanto à escolha e dinâmica da execução do repertório em suas apresentações.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 50 }}
                        animate={{ x: 0 }}
                        className="relative h-full min-h-[400px]"
                    >
                        <div className="relative overflow-hidden rounded-2xl h-full w-full">
                            <img
                                src="/images/general/geral-01.png"
                                alt="Foto da banda Forró do Horizonte"
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