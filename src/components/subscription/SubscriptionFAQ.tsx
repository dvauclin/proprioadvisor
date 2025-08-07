import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Euro, TrendingUp, CheckCircle, Zap, Users } from "lucide-react";

const SubscriptionFAQ: React.FC = () => {
  return (
    <div className="space-y-8 mt-12">
      {/* Combien coûte ProprioAdvisor */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Euro className="mr-3 h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Combien coûte ProprioAdvisor ?</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong className="text-green-600">L'inscription et le référencement sont 100% gratuits.</strong> Un abonnement est proposé pour maximiser votre visibilité.
            </p>
            <p>
              Le montant est à titre indicatif <strong>(5€ à 20€/mois)</strong> car il s'agit d'un système d'enchère flexible : vous êtes libre de saisir un montant plus ou moins élevé selon votre budget et vos objectifs.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <strong className="text-green-800">0% de commission sur vos contrats</strong>
              </div>
              <p className="text-green-700">
                Aucune commission n'est prélevée si un prospect vous contacte par le biais de ProprioAdvisor. Vous gardez 100% de vos revenus !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Que peut m'apporter ProprioAdvisor */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="mr-3 h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Que peut m'apporter ProprioAdvisor ?</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 font-bold text-lg min-w-[40px] h-10 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900">Accès à une clientèle qualifiée</h3>
                <p className="text-gray-700">ProprioAdvisor est consulté quotidiennement par des propriétaires recherchant activement une conciergerie. <a href="https://proprioadvisor.fr/trouver-des-clients-conciergerie-airbnb" className="text-gray-700 no-underline">Trouvez des clients pour votre conciergerie</a> en recevant des demandes directes via notre plateforme, ou selon vos options, soyez contacté via votre site web et/ou par téléphone.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 font-bold text-lg min-w-[40px] h-10 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900">Visibilité indirecte sur les IA et ChatGPT</h3>
                <p className="text-gray-700">
                  Si vous êtes sur ProprioAdvisor alors vos données seront indexées par ChatGPT et autres IA. <strong>Ne pas être référencé = manquer l'opportunité d'être recommandé </strong> 
                  lorsqu'un internaute questionne l'IA sur la délégation de gestion Airbnb dans votre zone.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionFAQ;