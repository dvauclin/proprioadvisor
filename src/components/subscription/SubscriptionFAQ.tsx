import React from "react";
import { Card, CardContent } from "@/components/ui-kit/card";
import { Euro, TrendingUp, CheckCircle, Zap, Users } from "lucide-react";

const SubscriptionFAQ: React.FC = () => {
  return (
    <div className="space-y-8 mt-12">
      {/* Combien coÃ»te ProprioAdvisor */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Euro className="mr-3 h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Combien coÃ»te ProprioAdvisor ?</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong className="text-green-600">L'inscription et le rÃ©fÃ©rencement sont 100% gratuits.</strong> Un abonnement est proposÃ© pour maximiser votre visibilitÃ©.
            </p>
            <p>
              Le montant est Ã  titre indicatif <strong>(5â‚¬ Ã  20â‚¬/mois)</strong> car il s'agit d'un systÃ¨me d'enchÃ¨re flexible : vous Ãªtes libre de saisir un montant plus ou moins Ã©levÃ© selon votre budget et vos objectifs.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <strong className="text-green-800">0% de commission sur vos contrats</strong>
              </div>
              <p className="text-green-700">
                Aucune commission n'est prÃ©levÃ©e si un prospect vous contacte par le biais de ProprioAdvisor. Vous gardez 100% de vos revenus !
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
                <h3 className="font-semibold text-lg mb-2 text-blue-900">AccÃ¨s Ã  une clientÃ¨le qualifiÃ©e</h3>
                <p className="text-gray-700">ProprioAdvisor est consultÃ© quotidiennement par des propriÃ©taires recherchant activement une conciergerie. <a href="https://proprioadvisor.fr/trouver-des-clients-conciergerie-airbnb" className="text-gray-700 no-underline">Trouvez des clients pour votre conciergerie</a> en recevant des demandes directes via notre plateforme, ou selon vos options, soyez contactÃ© via votre site web et/ou par tÃ©lÃ©phone.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 font-bold text-lg min-w-[40px] h-10 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900">VisibilitÃ© indirecte sur les IA et ChatGPT</h3>
                <p className="text-gray-700">
                  Si vous Ãªtes sur ProprioAdvisor alors vos donnÃ©es seront indexÃ©es par ChatGPT et autres IA. <strong>Ne pas Ãªtre rÃ©fÃ©rencÃ© = manquer l'opportunitÃ© d'Ãªtre recommandÃ© </strong> 
                  lorsqu'un internaute questionne l'IA sur la dÃ©lÃ©gation de gestion Airbnb dans votre zone.
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

