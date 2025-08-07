
import React, { useEffect, useState } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [headerHeight, setHeaderHeight] = useState(64); // Valeur par défaut
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Calculer dynamiquement la hauteur du header
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    // Calculer au chargement
    calculateHeaderHeight();

    // Recalculer si la fenêtre change de taille
    window.addEventListener('resize', calculateHeaderHeight);
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  // Détecter l'heading actif lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + headerHeight + 20; // 20px de marge

      // Trouver l'heading le plus proche du haut de l'écran
      let currentHeading = '';
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentHeading = headings[i].id;
          break;
        }
      }

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appeler une fois au chargement

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, headerHeight]);

  // Filtrer uniquement les H2
  const h2Headings = headings.filter((heading) => heading.level === 2);

  if (h2Headings.length === 0) return null;

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (element) {
      // Calculer la position avec l'offset du header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20; // 20px de marge supplémentaire
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Mettre à jour l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-8" role="navigation" aria-label="Sommaire de la page">
      <h2 className="text-lg font-bold mb-3 text-gray-900">Sommaire</h2>
      <nav aria-label="Navigation dans l'article">
        <ul className="space-y-2">
          {h2Headings.map((heading) => (
            <li key={heading.id}>
              <a 
                href={`#${heading.id}`} 
                onClick={(e) => handleAnchorClick(e, heading.id)}
                className={`block text-sm transition-colors duration-200 ${
                  activeHeading === heading.id
                    ? 'text-brand-chartreuse font-medium'
                    : 'text-gray-700 hover:text-brand-chartreuse hover:font-medium'
                }`}
                aria-current={activeHeading === heading.id ? 'location' : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
