"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui-kit/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-kit/dialog';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export const CookieSettings: React.FC = () => {
  const { cookieConsent, updateCookieConsent } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activÃ©
    analytics: cookieConsent.analytics,
    marketing: cookieConsent.marketing,
  });

  const savePreferences = () => {
    updateCookieConsent({
      ...preferences,
      necessary: true, // Toujours activÃ©
    });
    setOpen(false);
  };

  const handlePreferenceChange = (type: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-gray-500 hover:text-gray-700">
          GÃ©rer les cookies
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ParamÃ¨tres des cookies</DialogTitle>
          <DialogDescription>
            Personnalisez vos prÃ©fÃ©rences de cookies. Les cookies nÃ©cessaires sont toujours activÃ©s.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
            <Checkbox id="necessary-dialog" checked disabled />
            <div>
              <label htmlFor="necessary-dialog" className="font-medium cursor-not-allowed">
                Cookies nÃ©cessaires
              </label>
              <p className="text-sm text-gray-600">
                Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas Ãªtre dÃ©sactivÃ©s.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50">
            <Checkbox 
              id="analytics-dialog" 
              checked={preferences.analytics} 
              onCheckedChange={() => handlePreferenceChange('analytics')} 
            />
            <div>
              <label htmlFor="analytics-dialog" className="font-medium cursor-pointer">
                Cookies d'analyse
              </label>
              <p className="text-sm text-gray-600">
                Ces cookies nous permettent d'analyser l'utilisation du site pour en amÃ©liorer les performances et les services.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50">
            <Checkbox 
              id="marketing-dialog" 
              checked={preferences.marketing} 
              onCheckedChange={() => handlePreferenceChange('marketing')} 
            />
            <div>
              <label htmlFor="marketing-dialog" className="font-medium cursor-pointer">
                Cookies marketing
              </label>
              <p className="text-sm text-gray-600">
                Ces cookies sont utilisÃ©s pour suivre les visiteurs sur les sites web afin d'afficher des publicitÃ©s pertinentes.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={savePreferences}>
            Enregistrer les prÃ©fÃ©rences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

