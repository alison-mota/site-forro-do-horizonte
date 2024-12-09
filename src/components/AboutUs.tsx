import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-20 bg-amber-50" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-amber-900">
          Quem Somos
        </h2>
        <div className="max-w-3xl mx-auto text-lg text-amber-900 space-y-6">
          <p>
            Nascidos da paixão pela cultura nordestina, o Forró do Horizonte traz em sua 
            essência a autenticidade do forró pé de serra, mesclando tradição e modernidade 
            em cada apresentação.
          </p>
          <p>
            Com mais de uma década de estrada, nossa banda tem levado a alegria e a energia 
            contagiante do forró para os mais diversos palcos do Brasil, mantendo viva a 
            chama da música nordestina.
          </p>
          <p>
            Nossa missão é fazer cada apresentação única, transformando eventos em momentos 
            memoráveis, onde a tradição do forró se encontra com arranjos contemporâneos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;