"use client";

import React, { createContext, ReactNode } from 'react';

// DÃ©claration de type pour dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

type CookieConsentContextType = {
  cookieConsent: CookiePreferences;
  hasResponded: boolean;
  updateCookieConsent: (preferences: CookiePreferences) => void;
  resetCookieConsent: () => void;
};

const defaultConsent: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = React.useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

type CookieConsentProviderProps = {
  children: ReactNode;
};

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [cookieConsent, setCookieConsent] = React.useState<CookiePreferences>(defaultConsent);
  const [hasResponded, setHasResponded] = React.useState<boolean>(false);

  // Charger les prÃ©fÃ©rences de cookies depuis localStorage lors de l'initialisation - client only
  React.useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setCookieConsent(parsedConsent);
        setHasResponded(true);
        
        // RÃ©appliquer le consentement au chargement de la page - client only
        if (parsedConsent.analytics) {
          enableAnalytics();
        }
        if (parsedConsent.marketing) {
          enableMarketing();
        }
      } catch (error) {
        console.error('Erreur lors du chargement des prÃ©fÃ©rences de cookies:', error);
      }
    }
  }, []);

  const updateCookieConsent = (preferences: CookiePreferences) => {
    console.log('Mise Ã  jour du consentement cookies:', preferences);
    setCookieConsent(preferences);
    setHasResponded(true);
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));

    // Activer ou dÃ©sactiver les scripts en fonction des prÃ©fÃ©rences via GTM - client only
    if (preferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    if (preferences.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  };

  const resetCookieConsent = () => {
    localStorage.removeItem('cookieConsent');
    setCookieConsent(defaultConsent);
    setHasResponded(false);
    disableAnalytics();
    disableMarketing();
  };

  // Fonctions pour communiquer avec GTM - client only
  const enableAnalytics = () => {
    console.log('Activation des cookies analytiques');
    
    // Envoyer l'Ã©vÃ©nement Ã  GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'cookie_consent_analytics',
        'analytics_consent': 'granted'
      });
    }
  };

  const disableAnalytics = () => {
    console.log('DÃ©sactivation des cookies analytiques');
    
    // Envoyer l'Ã©vÃ©nement Ã  GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'cookie_consent_analytics',
        'analytics_consent': 'denied'
      });
    }
  };

  const enableMarketing = () => {
    console.log('Activation des cookies marketing');
    
    // Envoyer l'Ã©vÃ©nement Ã  GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'cookie_consent_marketing',
        'marketing_consent': 'granted'
      });
    }
  };

  const disableMarketing = () => {
    console.log('DÃ©sactivation des cookies marketing');
    
    // Envoyer l'Ã©vÃ©nement Ã  GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'cookie_consent_marketing',
        'marketing_consent': 'denied'
      });
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        cookieConsent,
        hasResponded,
        updateCookieConsent,
        resetCookieConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

