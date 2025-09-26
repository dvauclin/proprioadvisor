import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-kit/card";

const Alternatives: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 h-[640px] -z-10 bg-gradient-to-b from-brand-emerald-50 via-white to-white pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle at center, rgba(127,255,0,0.35), transparent 60%)" }}
        />
        <div
          className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle at center, rgba(0,191,255,0.25), transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">ProprioAdvisor et ses alternatives</h1>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contexte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Toutes ces plateformes ont pour objectif commun de connecter des propriétaires de locations courte durée avec des services de conciergerie, mais elles le font selon des approches et modèles économiques variés, offrant ainsi différentes expériences utilisateur.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProprioAdvisor vs. co-hôte Airbnb</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  La fonction Co-hôte d’Airbnb représente la solution interne à la plateforme. Elle est idéale pour les propriétaires déjà engagés sur Airbnb et qui souhaitent une solution clé-en-main au sein du même écosystème. L’avantage principal est la confiance et l’intégration technique : on collabore avec un co-hôte expérimenté directement via Airbnb, sans payer autre chose que la part du co-hôte. Cette option est particulièrement adaptée aux propriétaires ayant un ou quelques biens sur Airbnb et cherchant un appui local et modulable. En revanche, pour des besoins plus larges (multi-plateformes, formalisation contractuelle, etc.), on devra se tourner vers les autres plateformes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProprioAdvisor vs. QuelConcierge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  QuelConcierge adopte une approche courtier en devis. C’est la plateforme à privilégier si un propriétaire souhaite avant tout comparer les prix et obtenir la meilleure offre financière pour gérer son bien, sans passer du temps à évaluer chaque conciergerie. En quelques heures, il aura plusieurs devis en mains, ce qui est très efficace. C’est donc un choix guidé par la recherche du meilleur rapport qualité-prix via la concurrence. Pour les conciergeries prêtes à faire un effort commercial, c’est un bon moyen de gagner des clients rapidement, à condition de se démarquer dans le lot des devis (par le tarif ou par la qualité mise en avant). On peut considérer QuelConcierge comme un comparateur “automatique” : le propriétaire exprime sa demande, et la comparaison se fait via les réponses reçues plutôt que via une interface utilisateur riche.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProprioAdvisor vs. QuelleConciergerie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  QuelleConciergerie se présente comme un outil moderne tout-en-un pour optimiser la gestion locative. Il saura séduire les propriétaires qui aiment les données et les analyses : ceux qui veulent estimer leurs revenus potentiels, comprendre le marché, puis choisir rationnellement un prestataire local. C’est un choix orienté qualité de l’information et transparence. On y privilégie la conciergerie qui correspond le mieux aux critères plutôt que simplement le moins cher. Pour les conciergeries, y figurer assure une crédibilité (plateforme axée qualité) et attire des propriétaires déjà convaincus de l’utilité d’un service de gestion (puisqu’éduqués via le contenu et les estimations). QuelleConciergerie est en quelque sorte le comparateur nouvelle génération axé data, parfait pour ceux qui veulent le bon choix, pas juste le moins cher.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProprioAdvisor vs. Driing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Driing enfin apporte l’approche annuaire ouvert et communautaire. Cette plateforme est particulièrement intéressante pour les propriétaires qui souhaitent contacter directement plusieurs conciergeries locales et discuter librement avec elles, ou pour ceux qui sont sensibles à la philosophie sans commission. Driing donne une grande autonomie aux propriétaires dans la recherche (navigation par carte, profil détaillés) tout en restant simple d’utilisation. C’est l’outil idéal si l’on veut prendre contact personnellement avec des conciergeries pour comparer non seulement les offres, mais aussi le feeling humain ou la réactivité, par exemple. Pour les conciergeries, Driing représente une opportunité de marketing en ligne à faible coût, s’intégrant dans un écosystème plus large (celui de Driing, qui prône l’indépendance vis-à-vis des grandes plateformes). Cela correspondra particulièrement aux conciergeries qui valorisent un lien direct avec les clients et qui misent sur leur présentation détaillée pour convaincre.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Pourquoi ProprioAdvisor ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  ProprioAdvisor se distingue comme un comparateur transparent et indépendant. Il convient bien aux propriétaires qui veulent analyser par eux-mêmes plusieurs conciergeries en détail et garder la main sur le choix final. Ses nombreux critères de filtrage et son annuaire par ville en font un outil puissant pour obtenir une vision d’ensemble du marché. Côté conciergeries, c’est un canal de visibilité gratuit orienté qualité, qui pousse à la compétition sur les services et la réputation plus que sur le prix seul.
                </p>
                <p className="text-sm text-gray-600">proprioadvisor.fr</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatives;


