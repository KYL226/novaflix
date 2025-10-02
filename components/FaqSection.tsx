'use client';

import { useState } from 'react';

const faqs = [
  {
    q: "Qu'est-ce que Novaflix ?",
    a: "Novaflix est un service de streaming offrant une vaste sélection de films, séries, documentaires et plus, sur des milliers d'appareils connectés à Internet.",
  },
  {
    q: "Combien coûte Novaflix ?",
    a: "Regardez sur votre smartphone, tablette, TV connectée ou ordinateur pour un prix mensuel unique. Les plans commencent à 7,99€ par mois.",
  },
  {
    q: "Où puis-je regarder ?",
    a: "Regardez n'importe où, n'importe quand. Connectez-vous sur le web ou via l'application iOS/Android et utilisez les téléchargements pour regarder hors ligne.",
  },
  {
    q: "Comment annuler ?",
    a: "Novaflix est flexible. Pas de contrat ni d'engagement. Annulez en ligne à tout moment, sans frais.",
  },
  {
    q: "Que puis-je regarder ?",
    a: "Une vaste bibliothèque de films, séries, documentaires, et des exclusivités. De nouveaux titres ajoutés chaque semaine.",
  },
  {
    q: "Novaflix convient-il aux enfants ?",
    a: "L'expérience enfants incluse avec contrôle parental, profils dédiés, et un espace pensé pour les familles.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black text-white border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-8">Questions fréquentes</h2>

        <div className="space-y-2">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-[#2d2d2d]">
                <button
                  className="w-full flex justify-between items-center text-left px-6 py-5 text-lg md:text-2xl"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{item.q}</span>
                  <span className="text-3xl leading-none">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0 text-base md:text-xl text-gray-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-gray-300">
          <p className="mb-4 text-sm md:text-base">Prêt à regarder ? Saisis ton email pour créer ou réactiver ton abonnement.</p>
          <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Adresse e‑mail"
              className="flex-1 px-4 py-4 rounded md:rounded-l md:rounded-r-none bg-white text-black placeholder-gray-600"
            />
            <a href="/auth" className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded md:rounded-r md:rounded-l-none font-bold text-lg whitespace-nowrap">Commencer</a>
          </div>
        </div>
      </div>
    </section>
  );
}



