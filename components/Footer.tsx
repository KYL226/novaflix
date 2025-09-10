// components/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Novaflix": [
      { name: "À propos", href: "/about" },
      { name: "Carrières", href: "/careers" },
      { name: "Presse", href: "/press" },
      { name: "Investisseurs", href: "/investors" }
    ],
    "Support": [
      { name: "Centre d'aide", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Statut du service", href: "/status" },
      { name: "Accessibilité", href: "/accessibility" }
    ],
    "Légal": [
      { name: "Conditions d'utilisation", href: "/terms" },
      { name: "Confidentialité", href: "/privacy" },
      { name: "Cookies", href: "/cookies" },
      { name: "Mentions légales", href: "/legal" }
    ],
    "Contenu": [
      { name: "Films", href: "/films" },
      { name: "Séries", href: "/series" },
      { name: "Documentaires", href: "/documentaires" },
      { name: "Nouveautés", href: "/new" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-bold text-red-600 mb-4 block">
              Novaflix
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              La plateforme de streaming qui vous offre le meilleur du cinéma et de la télévision. 
              Découvrez des milliers de contenus en haute qualité.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@novaflix.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">Restez informé</h3>
            <p className="text-gray-400 mb-4">
              Recevez les dernières nouveautés et offres exclusives
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>© {currentYear} Novaflix. Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>en France</span>
            </div>
            
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
