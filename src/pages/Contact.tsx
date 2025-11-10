import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Calendar, Music } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const Contact = () => {
    return (
        <PageBackground>
            <div className="container mx-auto px-4 pt-8 pb-16">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            className="space-y-8"
                        >
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
                                <h3 className="text-2xl font-semibold mb-6 text-amber-200 text-center">
                                    Informações de Contato
                                </h3>
                                <div className="space-y-6">
                                    <a
                                        href="mailto:forrodohorizonte@gmail.com"
                                        className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors group"
                                    >
                                        <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-amber-100/80">forrodohorizonte@gmail.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://wa.me/5534999023439"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-white hover:text-amber-200 transition-colors group"
                                    >
                                        <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <div>
                                            <p className="font-medium">Telefone</p>
                                            <p className="text-amber-100/80">(34) 99902-3439</p>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-3 text-white">
                                        <MapPin className="w-6 h-6" />
                                        <div>
                                            <p className="font-medium">Localização</p>
                                            <p className="text-amber-100/80">Uberlândia, Minas Gerais</p>
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
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageBackground>
    );
};

export default Contact;