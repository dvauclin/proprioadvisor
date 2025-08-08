
export const isBot = (): boolean => {
  // Return true in SSR mode (no window)
  if (typeof window === 'undefined') {
    return true;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // Enhanced list of bot patterns synchronized with prerender function
  const botPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'applebot', 'crawler', 'spider',
    'headlesschrome', 'phantomjs', 'puppeteer', 'selenium', 'webdriver',
    'playwright', 'chrome-lighthouse', 'pagespeed', 'gtmetrix',
    // Google specific bots and tools
    'google-inspectiontool', 'google-structured-data-testing-tool',
    'google-read-aloud', 'googleother', 'adsbot-google', 'google-extended',
    'apis-google', 'google-safety', 'google-rich-results', 'mediapartners-google'
  ];

  return botPatterns.some(pattern => userAgent.includes(pattern));
};

// Emergency client-side prerender detection
export const isPrerendered = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // Check for prerender headers or URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('_prerender') || 
         document.querySelector('meta[name="prerender"]') !== null ||
         window.location.pathname.includes('prerender');
};

// Force basic SEO data for emergency fallback
export const getEmergencyMetaData = (pathname: string) => {
  const villeMatch = pathname.match(/^\/conciergerie\/([a-zA-Z0-9-]+)/);
  
  if (villeMatch) {
    const citySlug = villeMatch[1];
    const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
    
    return {
      title: `Conciergerie Airbnb ${cityName} | Proprioadvisor`,
      description: `Trouvez la meilleure conciergerie Airbnb à ${cityName}. Comparaison des tarifs et services pour optimiser vos revenus locatifs.`,
      canonical: `https://proprioadvisor.fr${pathname}`
    };
  }
  
  return {
    title: 'Proprioadvisor | Comparateur de conciergeries Airbnb',
    description: 'Trouvez la meilleure conciergerie pour votre bien en location courte durée',
    canonical: `https://proprioadvisor.fr${pathname}`
  };
};

