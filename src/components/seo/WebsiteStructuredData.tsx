import React from 'react';
import StructuredData from './StructuredData';

const WebsiteStructuredData = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ProprioAdvisor',
    url: 'https://proprioadvisor.fr',
    description: 'Comparateur de conciergeries Airbnb pour les propriÃ©taires',
    publisher: {
      '@type': 'Organization',
      name: 'ProprioAdvisor',
      url: 'https://proprioadvisor.fr'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://proprioadvisor.fr/annuaire?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://twitter.com/proprioadvisor',
      'https://linkedin.com/company/proprioadvisor'
    ]
  };

  return <StructuredData data={data} />;
};

export default WebsiteStructuredData; 

