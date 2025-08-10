import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-kit/card";

const APropos: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
        {/* Gradient overlay like home page */}
        <div className="absolute inset-x-0 top-0 h-[640px] -z-10 bg-gradient-to-b from-brand-emerald-50 via-white to-white pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50"
               style={{ background: "radial-gradient(circle at center, rgba(127,255,0,0.35), transparent 60%)" }} />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle at center, rgba(0,191,255,0.25), transparent 60%)" }} />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">À propos de ProprioAdvisor</h1>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  ProprioAdvisor est né d'un constat simple : choisir une conciergerie pour son bien en location courte durée est un parcours du combattant. Entre les différents tarifs, services proposés et zones de couverture, il était difficile de s'y retrouver.
                </p>
                <p>
                  Notre mission est de simplifier cette recherche en vous proposant le comparateur le plus complet du marché français. Nous analysons en profondeur chaque conciergerie pour vous permettre de faire le meilleur choix selon vos besoins spécifiques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Ce qui nous différencie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Comparaison approfondie</h3>
                    <p className="text-sm text-gray-600">
                      Nous ne nous contentons pas de lister les conciergeries. Nous analysons leurs tarifs, services, zones de couverture et critères d'acceptation pour vous donner une vue d'ensemble complète.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Neutralité garantie</h3>
                    <p className="text-sm text-gray-600">
                      Notre plateforme est indépendante. Nous ne favorisons aucune conciergerie et présentons l'information de manière objective pour vous aider dans votre choix.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Expertise locale</h3>
                    <p className="text-sm text-gray-600">
                      Nous connaissons le marché français de la location courte durée et ses spécificités. Notre expertise nous permet de vous conseiller au mieux.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Outils gratuits</h3>
                    <p className="text-sm text-gray-600">
                      En plus du comparateur, nous proposons des outils gratuits comme notre simulateur de revenus Airbnb pour vous accompagner dans votre projet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  ProprioAdvisor a été fondé par David Vauclin, expert en location courte durée avec plusieurs années d'expérience dans le secteur. Passionné par l'optimisation des revenus locatifs, David a créé cette plateforme pour partager son expertise et aider les propriétaires à faire les meilleurs choix.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous nous engageons à maintenir la qualité et l'exactitude des informations présentes sur notre plateforme. Nos données sont régulièrement mises à jour et nous travaillons en permanence pour améliorer votre expérience utilisateur.
                </p>
                <p>
                  Si vous avez des questions, suggestions ou remarques, n'hésitez pas à nous contacter. Votre feedback nous aide à améliorer constamment notre service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
    </div>
  );
};

export default APropos;

