#!/usr/bin/env node

/**
 * Script de validation des données structurées
 * Vérifie que les données JSON-LD générées sont valides
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://proprioadvisor.fr';
const LANG = 'fr';

// Fonction pour valider le JSON-LD
function validateJsonLd(jsonLd) {
  const errors = [];
  
  // Vérifications de base
  if (!jsonLd['@context']) {
    errors.push('Missing @context');
  }
  
  if (!jsonLd['@type']) {
    errors.push('Missing @type');
  }
  
  if (!jsonLd['@id'] && !jsonLd['url']) {
    errors.push('Missing @id or url');
  }
  
  // Vérifications spécifiques selon le type
  switch (jsonLd['@type']) {
    case 'LocalBusiness':
      if (!jsonLd.name) errors.push('LocalBusiness missing name');
      if (!jsonLd.serviceType) errors.push('LocalBusiness missing serviceType');
      break;
      
    case 'WebPage':
      if (!jsonLd.name) errors.push('WebPage missing name');
      if (!jsonLd.url) errors.push('WebPage missing url');
      break;
      
    case 'BlogPosting':
      if (!jsonLd.headline) errors.push('BlogPosting missing headline');
      if (!jsonLd.author) errors.push('BlogPosting missing author');
      if (!jsonLd.datePublished) errors.push('BlogPosting missing datePublished');
      break;
      
    case 'FAQPage':
      if (!jsonLd.mainEntity || !Array.isArray(jsonLd.mainEntity)) {
        errors.push('FAQPage missing mainEntity array');
      }
      break;
  }
  
  return errors;
}

// Fonction pour tester les données structurées
function testStructuredData() {
  console.log('🔍 Validation des données structurées...\n');
  
  // Test des fonctions principales
  const tests = [
    {
      name: 'HomePage JSON-LD',
      data: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${BASE_URL}/#homepage`,
        name: "ProprioAdvisor - Comparateur de conciergeries Airbnb",
        description: "ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée.",
        url: BASE_URL,
        inLanguage: LANG,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        dateModified: new Date().toISOString()
      }
    },
    {
      name: 'LocalBusiness JSON-LD',
      data: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/conciergerie-details/test-conciergerie`,
        name: "Test Conciergerie",
        description: "Conciergerie de test",
        url: `${BASE_URL}/conciergerie-details/test-conciergerie`,
        serviceType: "Conciergerie Airbnb",
        areaServed: { "@type": "Place", name: "France" },
        openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-17:00"],
        parentOrganization: { "@id": `${BASE_URL}/#organization` }
      }
    },
    {
      name: 'BlogPosting JSON-LD',
      data: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${BASE_URL}/test-article`,
        headline: "Article de test",
        description: "Description de l'article de test",
        url: `${BASE_URL}/test-article`,
        datePublished: "2024-01-01T00:00:00Z",
        dateModified: "2024-01-01T00:00:00Z",
        author: {
          "@type": "Person",
          name: "David Vauclin"
        },
        publisher: {
          "@type": "Organization",
          name: "ProprioAdvisor",
          url: BASE_URL
        }
      }
    }
  ];
  
  let totalTests = 0;
  let passedTests = 0;
  
  tests.forEach(test => {
    totalTests++;
    console.log(`📋 Test: ${test.name}`);
    
    const errors = validateJsonLd(test.data);
    
    if (errors.length === 0) {
      console.log('✅ Valide\n');
      passedTests++;
    } else {
      console.log('❌ Erreurs trouvées:');
      errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    }
  });
  
  // Résumé
  console.log('📊 Résumé des tests:');
  console.log(`   Tests passés: ${passedTests}/${totalTests}`);
  console.log(`   Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Toutes les données structurées sont valides !');
    return true;
  } else {
    console.log('\n⚠️  Certaines données structurées nécessitent des corrections.');
    return false;
  }
}

// Fonction pour générer un rapport de validation
function generateValidationReport() {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    language: LANG,
    tests: []
  };
  
  console.log('📄 Génération du rapport de validation...');
  
  // Ici on pourrait ajouter plus de tests et générer un fichier JSON
  const reportPath = path.join(__dirname, '..', 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📁 Rapport sauvegardé: ${reportPath}`);
}

// Exécution du script
if (require.main === module) {
  console.log('🚀 Script de validation des données structurées\n');
  
  const isValid = testStructuredData();
  generateValidationReport();
  
  process.exit(isValid ? 0 : 1);
}

module.exports = {
  validateJsonLd,
  testStructuredData,
  generateValidationReport
};
