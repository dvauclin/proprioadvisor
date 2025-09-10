"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { CookieSettings } from "@/components/CookieSettings";

const footerCities = [
  { nom: "Paris", slug: "paris" },
  { nom: "Lyon", slug: "lyon" },
  { nom: "Marseille", slug: "marseille" },
  { nom: "Nice", slug: "nice" },
  { nom: "Bordeaux", slug: "bordeaux" },
  { nom: "Lille", slug: "lille" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info - 1/4 */}
          <section className="space-y-4">
            <Link href="/" className="flex items-center focus:outline-none rounded-md">
              <div className="w-10 h-10 bg-brand-chartreuse rounded-full mr-3" aria-hidden="true"></div>
              <span className="text-xl font-semibold">PROPRIOADVISOR</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              La plateforme de référence pour comparer et choisir votre conciergerie Airbnb. 
              Trouvez le prestataire idéal pour optimiser la gestion de votre location courte durée.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur Facebook"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/proprioadvisor/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur Instagram"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur YouTube"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href="https://www.tiktok.com/@proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur TikTok"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </section>
          
          {/* Useful Links - 1/4 */}
          <section>
            <h3 className="font-semibold text-lg mb-4">Liens utiles</h3>
            <nav aria-label="Navigation du pied de page" className="flex flex-col space-y-3 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Accueil Proprioadvisor</Link>
              <Link href="/simulateur-airbnb" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Simulateur Airbnb gratuit</Link>
              <Link href="/favoris" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Mes favoris</Link>
              <Link href="/blog" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Blog</Link>
              <Link href="/annuaire" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Annuaire conciergerie</Link>
              <Link href="/a-propos" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">À propos</Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Contact</Link>
              <Link href="/inscription" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Inscrire ma conciergerie</Link>
              <Link href="/trouver-des-clients-conciergerie-airbnb" className="text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Trouver des clients conciergerie Airbnb</Link>
            </nav>
          </section>
          
          {/* City Comparisons - 2/4 (2 columns) */}
          <section className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Comparateur par ville</h3>
            <nav aria-label="Navigation par ville" className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {/* Column 1: Paris, Lyon, Marseille */}
              <div className="space-y-3">
                {footerCities.slice(0, 3).map((ville) => (
                  <Link 
                    key={ville.slug} 
                    href={`/conciergerie/${ville.slug}`}
                    className="text-gray-600 hover:text-primary hover:bg-primary/5 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors"
                  >
                    Conciergerie Airbnb {ville.nom}
                  </Link>
                ))}
              </div>
              {/* Column 2: Nice, Bordeaux, Lille */}
              <div className="space-y-3">
                {footerCities.slice(3, 6).map((ville) => (
                  <Link 
                    key={ville.slug} 
                    href={`/conciergerie/${ville.slug}`}
                    className="text-gray-600 hover:text-primary hover:bg-primary/5 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors"
                  >
                    Conciergerie Airbnb {ville.nom}
                  </Link>
                ))}
              </div>
            </nav>
          </section>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Centered legal links */}
            <nav className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto" aria-label="Liens légaux">
              <Link href="/mentions-legales" className="text-sm text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Mentions légales</Link>
              <Link href="/politique-confidentialite" className="text-sm text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Politique de confidentialité</Link>
              <Link href="/conditions-utilisation" className="text-sm text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full px-2 py-1 transition-colors">Conditions Générales d'Utilisation</Link>
              <CookieSettings />
            </nav>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a 
                href="https://www.facebook.com/proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur Facebook"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/proprioadvisor/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur Instagram"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur YouTube"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href="https://www.tiktok.com/@proprioadvisor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur TikTok"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-2 transition-colors"
              >
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ProprioAdvisor. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

