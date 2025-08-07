import React from 'react';
import StructuredData from './StructuredData';

const OrganizationStructuredData = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ProprioAdvisor',
    url: 'https://proprioadvisor.fr',
    logo: 'https://proprioadvisor.fr/logo.png',
    description: 'Comparateur de conciergeries Airbnb pour les propriétaires',
    sameAs: [
      'https://twitter.com/proprioadvisor',
      'https://linkedin.com/company/proprioadvisor'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@proprioadvisor.fr'
    }
  };

  return <StructuredData data={data} />;
};

export default OrganizationStructuredData; 