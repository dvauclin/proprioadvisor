// Types globaux pour Next.js

interface Window {
  // Stripe
  Stripe?: any;
  
  // Mapbox
  mapboxgl?: any;
  
  // Cal.com
  Cal?: any;
  
  // Analytics
  gtag?: (...args: any[]) => void;
  
  // Custom properties
  __NEXT_DATA__?: any;
}

declare global {
  interface Window {
    Stripe?: any;
    mapboxgl?: any;
    Cal?: any;
    gtag?: (...args: any[]) => void;
    __NEXT_DATA__?: any;
  }
}

export {}; 
