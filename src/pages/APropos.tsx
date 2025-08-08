import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-kit/card";

const APropos: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Ã€ propos de ProprioAdvisor</h1>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  ProprioAdvisor est nÃ© d'un constat simple : choisir une conciergerie pour son bien en location courte durÃ©e est un parcours du combattant. Entre les diffÃ©rents tarifs, services proposÃ©s et zones de couverture, il Ã©tait difficile de s'y retrouver.
                </p>
                <p>
                  Notre mission est de simplifier cette recherche en vous proposant le comparateur le plus complet du marchÃ© franÃ§ais. Nous analysons en profondeur chaque conciergerie pour vous permettre de faire le meilleur choix selon vos besoins spÃ©cifiques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Ce qui nous diffÃ©rencie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Comparaison approfondie</h3>
                    <p className="text-sm text-gray-600">
                      Nous ne nous contentons pas de lister les conciergeries. Nous analysons leurs tarifs, services, zones de couverture et critÃ¨res d'acceptation pour vous donner une vue d'ensemble complÃ¨te.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">NeutralitÃ© garantie</h3>
                    <p className="text-sm text-gray-600">
                      Notre plateforme est indÃ©pendante. Nous ne favorisons aucune conciergerie et prÃ©sentons l'information de maniÃ¨re objective pour vous aider dans votre choix.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Expertise locale</h3>
                    <p className="text-sm text-gray-600">
                      Nous connaissons le marchÃ© franÃ§ais de la location courte durÃ©e et ses spÃ©cificitÃ©s. Notre expertise nous permet de vous conseiller au mieux.
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
                <CardTitle className="text-2xl">Notre Ã©quipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  ProprioAdvisor a Ã©tÃ© fondÃ© par David Vauclin, expert en location courte durÃ©e avec plusieurs annÃ©es d'expÃ©rience dans le secteur. PassionnÃ© par l'optimisation des revenus locatifs, David a crÃ©Ã© cette plateforme pour partager son expertise et aider les propriÃ©taires Ã  faire les meilleurs choix.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous nous engageons Ã  maintenir la qualitÃ© et l'exactitude des informations prÃ©sentes sur notre plateforme. Nos donnÃ©es sont rÃ©guliÃ¨rement mises Ã  jour et nous travaillons en permanence pour amÃ©liorer votre expÃ©rience utilisateur.
                </p>
                <p>
                  Si vous avez des questions, suggestions ou remarques, n'hÃ©sitez pas Ã  nous contacter. Votre feedback nous aide Ã  amÃ©liorer constamment notre service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default APropos;

