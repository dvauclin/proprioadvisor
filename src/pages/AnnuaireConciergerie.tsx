import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui-kit/button";
import { Search, Users, CheckCircle, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/ui-kit/breadcrumbs";

const AnnuaireConciergerie = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
        {/* Gradient overlay like home page */}
        <div className="absolute inset-x-0 top-0 h-[640px] -z-10 bg-gradient-to-b from-brand-emerald-50 via-white to-white pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50"
               style={{ background: "radial-gradient(circle at center, rgba(127,255,0,0.35), transparent 60%)" }} />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle at center, rgba(0,191,255,0.25), transparent 60%)" }} />
        </div>


        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center leading-tight">
              Annuaire des conciergeries Airbnb
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
              Trouver la meilleure conciergerie près de chez vous
            </p>
            
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                ProprioAdvisor est bien plus qu'un simple annuaire : c'est une plateforme de rencontre 
                entre propriétaires de logements Airbnb et conciergeries professionnelles. Notre service 
                gratuit pour les propriétaires permet de comparer facilement les offres et de trouver 
                la conciergerie parfaite pour votre bien en location courte durée.
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
        <section className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              Recherchez une conciergerie selon votre ville et vos besoins
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-12">
                             <div className="space-y-6">
                 <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                   <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                     <Search className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                     Filtres de recherche disponibles
                   </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>⬢ Recherche par ville et région</li>
                    <li>⬢ Type de bien (appartement, maison, etc.)</li>
                    <li>⬢ Niveau de service souhaité</li>
                    <li>⬢ Commission et tarification</li>
                    <li>⬢ Services spécialisés</li>
                  </ul>
                </div>
              </div>
              
                             <div className="space-y-6">
                 <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                   <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                     <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                     Avantages ProprioAdvisor
                   </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>⬢ Gain de temps considérable</li>
                    <li>⬢ Prestataires qualifiés et référencés</li>
                    <li>⬢ Comparaison facile et rapide</li>
                    <li>⬢ Service 100% gratuit</li>
                    <li>⬢ Mise en relation directe</li>
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
        <section className="container mx-auto px-4 py-8 sm:py-16 bg-muted/30 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center">
              Vous êtes une conciergerie ? Rejoignez notre annuaire spécialisé
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-12">
                             <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                 <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                   <Users className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                   Avantages pour les conciergeries
                 </h3>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>⬢ Visibilité accrue auprès des propriétaires</li>
                  <li>⬢ Leads qualifiés et ciblés</li>
                  <li>⬢ Filtres personnalisés selon vos critères</li>
                  <li>⬢ Zone géographique définie par vous</li>
                  <li>⬢ Types de biens de votre choix</li>
                </ul>
              </div>
              
                             <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                 <h3 className="text-lg sm:text-xl font-semibold mb-4">
                   Rejoignez-nous dès maintenant
                 </h3>
                <p className="text-muted-foreground mb-6">
                  Chaque conciergerie peut définir ses critères de zone géographique, 
                  types de biens acceptés et niveau de service proposé.
                </p>
                <div className="space-y-3">
                  <Link href="/inscription" className="block">
                    <Button className="w-full text-sm sm:text-base">
                      Inscrivez votre conciergerie
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/trouver-des-clients-conciergerie-airbnb" className="block">
                    <Button variant="outline" className="w-full text-sm sm:text-base">
                      Découvrir comment trouver des clients
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir Section */}
        <section className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              Pourquoi choisir ProprioAdvisor comme annuaire de conciergeries ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Plateforme spécialisée</h3>
                    <p className="text-muted-foreground">
                      Exclusivement dédiée aux locations courte durée et conciergeries Airbnb
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Fonctionnement 100% en ligne</h3>
                    <p className="text-muted-foreground">
                      Interface moderne et intuitive pour une expérience utilisateur optimale
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
                    <h3 className="font-semibold mb-2">0cosystème technique solide</h3>
                    <p className="text-muted-foreground">
                      SPA moderne, filtres intelligents, intégration Stripe et infrastructure robuste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-8 sm:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              Questions fréquentes sur notre annuaire conciergerie
            </h2>
            
                         <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-6">
                                 <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                   <h3 className="font-semibold mb-3">Comment fonctionne la mise en relation ?</h3>
                  <p className="text-muted-foreground">
                    Vous recherchez selon vos critères, comparez les offres et contactez 
                    directement les conciergeries qui vous intéressent via notre plateforme.
                  </p>
                </div>
                
                                 <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                   <h3 className="font-semibold mb-3">Est-ce gratuit pour les propriétaires ?</h3>
                  <p className="text-muted-foreground">
                    Oui, notre service est entièrement gratuit pour les propriétaires. 
                    Vous ne payez que la conciergerie que vous choisissez.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                                 <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border">
                   <h3 className="font-semibold mb-3">Quels types de logements sont concernés ?</h3>
                  <p className="text-muted-foreground">
                    Tous types de biens en location courte durée : appartements, maisons, 
                    studios, villas, etc.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Qui peut s'inscrire en tant que conciergerie ?</h3>
                  <p className="text-muted-foreground">
                    Toute entreprise ou professionnel proposant des services de gestion 
                    de locations courte durée peut rejoindre notre annuaire.
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


