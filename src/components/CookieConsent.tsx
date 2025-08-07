"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const CookieConsent: React.FC = () => {
  const { cookieConsent, hasResponded, updateCookieConsent } = useCookieConsent();
  const [showDetails, setShowDetails] = React.useState(false);

  const [preferences, setPreferences] = React.useState({
    necessary: true, // Toujours activé
    analytics: cookieConsent.analytics,
    marketing: cookieConsent.marketing,
  });

  // Ne pas afficher pour les bots.
  // Le dialog est contrôlé par l'état `hasResponded`.
  if (isBot()) {
    return null;
  }

  const acceptAll = () => {
    updateCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptSelected = () => {
    updateCookieConsent({
      ...preferences,
      necessary: true, // Toujours activé
    });
  };

  const rejectAll = () => {
    updateCookieConsent({
      necessary: true, // Toujours activé
      analytics: false,
      marketing: false,
    });
  };

  const handlePreferenceChange = (type: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Si l'utilisateur ferme la modale (Echap, 'X', clic extérieur), on considère cela comme un refus.
  const handleDialogClose = () => {
    if (!hasResponded) {
      rejectAll();
    }
  };

  return (
    <Dialog open={!hasResponded} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showDetails ? (
          <div>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold mb-3 text-left">Nous respectons votre vie privée</DialogTitle>
              <DialogDescription className="text-gray-600 mb-4 text-left">
                Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies, 
                les refuser tous ou personnaliser vos préférences.
              </DialogDescription>
              <div className="text-sm text-gray-500 text-left">
                <Link href="/politique-confidentialite" className="text-blue-600 hover:underline">
                  Politique de confidentialité
                </Link>
                {' | '}
                <Link href="/conditions-utilisation" className="text-blue-600 hover:underline">
                  Conditions d'utilisation
                </Link>
              </div>
            </DialogHeader>
            
            <DialogFooter className="flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDetails(true)}>
                Personnaliser
              </Button>
              <Button variant="outline" onClick={rejectAll}>
                Refuser tout
              </Button>
              <Button
                className="bg-brand-chartreuse text-black hover:bg-brand-chartreuse/90"
                onClick={acceptAll}
              >
                Accepter tout
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold mb-3 text-left">Personnaliser vos préférences</DialogTitle>
              <DialogDescription className="text-gray-600 mb-4 text-left">
                Choisissez les types de cookies que vous acceptez. Les cookies nécessaires sont toujours activés.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Cookies nécessaires</h3>
                  <p className="text-sm text-gray-600">Essentiels au fonctionnement du site</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Cookies analytiques</h3>
                  <p className="text-sm text-gray-600">Nous aident à améliorer le site</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Cookies marketing</h3>
                  <p className="text-sm text-gray-600">Utilisés pour la publicité personnalisée</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Retour
              </Button>
              <Button variant="outline" onClick={rejectAll}>
                Refuser tout
              </Button>
              <Button
                className="bg-brand-chartreuse text-black hover:bg-brand-chartreuse/90"
                onClick={acceptSelected}
              >
                Accepter la sélection
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Fonction pour détecter les bots
function isBot(): boolean {
  if (typeof window === 'undefined') return true;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'googlebot', 'bingbot', 'slurp',
    'duckduckbot', 'baiduspider', 'yandexbot', 'facebookexternalhit', 'twitterbot',
    'rogerbot', 'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
    'outbrain', 'pinterest', 'slackbot', 'vkShare', 'W3C_Validator'
  ];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
}

export default CookieConsent;
