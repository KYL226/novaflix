// components/Footer.tsx
'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    'FAQ',
    "Centre d'aide",
    'Compte',
    'Moyens de regarder',
    'Mentions légales',
    'Confidentialité',
    'Préférences de cookies',
    "Informations d'entreprise",
    'Nous contacter',
  ];

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/" className="text-2xl font-bold text-red-600">Novaflix</Link>
        </div>
        <p className="mb-6">Des questions ? Appelez le <a className="underline" href="tel:+33123456789">+33 1 23 45 67 89</a></p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {links.map((name) => (
            <Link key={name} href="#" className="hover:text-white text-sm">{name}</Link>
          ))}
        </div>
        <p className="text-xs">© {currentYear} Novaflix</p>
      </div>
    </footer>
  );
}
