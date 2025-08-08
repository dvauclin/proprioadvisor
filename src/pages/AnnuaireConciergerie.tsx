import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui-kit/button";
import { Search, Users, CheckCircle, ArrowRight } from "lucide-react";

const AnnuaireConciergerie = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Annuaire des conciergeries Airbnb â€“ Trouvez la meilleure conciergerie prÃ¨s de chez vous
            </h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                ProprioAdvisor est bien plus qu'un simple annuaire : c'est une plateforme de rencontre 
                entre propriÃ©taires de logements Airbnb et conciergeries professionnelles. Notre service 
                gratuit pour les propriÃ©taires permet de comparer facilement les offres et de trouver 
                la conciergerie parfaite pour votre bien en location courte durÃ©e.
              </p>
            </div>

            <Link href="/">
              <Button className="text-lg px-6 py-3">
                <Search className="mr-2 h-5 w-5" />
                Rechercher une conciergerie
              </Button>
            </Link>
          </div>
        </section>

        {/* Recherche Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Recherchez une conciergerie selon votre ville et vos besoins
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Search className="mr-2 h-5 w-5 text-primary" />
                    Filtres de recherche disponibles
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>â€¢ Recherche par ville et rÃ©gion</li>
                    <li>â€¢ Type de bien (appartement, maison, etc.)</li>
                    <li>â€¢ Niveau de service souhaitÃ©</li>
                    <li>â€¢ Commission et tarification</li>
                    <li>â€¢ Services spÃ©cialisÃ©s</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    Avantages ProprioAdvisor
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>â€¢ Gain de temps considÃ©rable</li>
                    <li>â€¢ Prestataires qualifiÃ©s et rÃ©fÃ©rencÃ©s</li>
                    <li>â€¢ Comparaison facile et rapide</li>
                    <li>â€¢ Service 100% gratuit</li>
                    <li>â€¢ Mise en relation directe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/">
                <Button className="text-lg px-6 py-3">
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher une conciergerie
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Conciergeries Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Vous Ãªtes une conciergerie ? Rejoignez notre annuaire spÃ©cialisÃ©
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Avantages pour les conciergeries
                </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>â€¢ VisibilitÃ© accrue auprÃ¨s des propriÃ©taires</li>
                  <li>â€¢ Leads qualifiÃ©s et ciblÃ©s</li>
                  <li>â€¢ Filtres personnalisÃ©s selon vos critÃ¨res</li>
                  <li>â€¢ Zone gÃ©ographique dÃ©finie par vous</li>
                  <li>â€¢ Types de biens de votre choix</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">
                  Rejoignez-nous dÃ¨s maintenant
                </h3>
                <p className="text-muted-foreground mb-6">
                  Chaque conciergerie peut dÃ©finir ses critÃ¨res de zone gÃ©ographique, 
                  types de biens acceptÃ©s et niveau de service proposÃ©.
                </p>
                <div className="space-y-3">
                  <Link href="/inscription" className="block">
                    <Button className="w-full">
                      Inscrivez votre conciergerie
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/trouver-des-clients-conciergerie-airbnb" className="block">
                    <Button variant="outline" className="w-full">
                      DÃ©couvrir comment trouver des clients
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Pourquoi choisir ProprioAdvisor comme annuaire de conciergeries ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Plateforme spÃ©cialisÃ©e</h3>
                    <p className="text-muted-foreground">
                      Exclusivement dÃ©diÃ©e aux locations courte durÃ©e et conciergeries Airbnb
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Fonctionnement 100% en ligne</h3>
                    <p className="text-muted-foreground">
                      Interface moderne et intuitive pour une expÃ©rience utilisateur optimale
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Comparaison rapide et intuitive</h3>
                    <p className="text-muted-foreground">
                      Filtres intelligents et tableau comparatif pour faciliter votre choix
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Ã‰cosystÃ¨me technique solide</h3>
                    <p className="text-muted-foreground">
                      SPA moderne, filtres intelligents, intÃ©gration Stripe et infrastructure robuste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Questions frÃ©quentes sur notre annuaire conciergerie
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Comment fonctionne la mise en relation ?</h3>
                  <p className="text-muted-foreground">
                    Vous recherchez selon vos critÃ¨res, comparez les offres et contactez 
                    directement les conciergeries qui vous intÃ©ressent via notre plateforme.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Est-ce gratuit pour les propriÃ©taires ?</h3>
                  <p className="text-muted-foreground">
                    Oui, notre service est entiÃ¨rement gratuit pour les propriÃ©taires. 
                    Vous ne payez que la conciergerie que vous choisissez.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Quels types de logements sont concernÃ©s ?</h3>
                  <p className="text-muted-foreground">
                    Tous types de biens en location courte durÃ©e : appartements, maisons, 
                    studios, villas, etc.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Qui peut s'inscrire en tant que conciergerie ?</h3>
                  <p className="text-muted-foreground">
                    Toute entreprise ou professionnel proposant des services de gestion 
                    de locations courte durÃ©e peut rejoindre notre annuaire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default AnnuaireConciergerie;


