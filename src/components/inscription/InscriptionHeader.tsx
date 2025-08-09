
import React from "react";

interface InscriptionHeaderProps {
}

const InscriptionHeader: React.FC<InscriptionHeaderProps> = () => {
  return (
    <div className="mb-12 text-center">
      {/* Hero Section */}
      <div className="mb-12 px-0">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Rejoignez le réseau de conciergeries de ProprioAdvisor
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Inscription gratuite en 3 min
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            Options payantes facultatives
          </div>
        </div>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
          ProprioAdvisor.fr est un comparateur de conciergeries qui aide les propriétaires à trouver la conciergerie idéale selon leurs besoins spécifiques. Renseignez vos critères de localisation et de qualité et vous recevrez des prospects qui vous correspondent.
        </p>
      </div>
    </div>
  );
};

export default InscriptionHeader;

