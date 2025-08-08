import React from "react";
import { Conciergerie, Ville } from "@/types";

interface GeneralInfoSectionProps {
  conciergerie: Conciergerie;
  updateField?: (field: keyof Conciergerie, value: any) => void;
  isEditing?: boolean;
  villes?: Map<string, Ville>;
  getPropertyTypeLabel?: (type: string) => string;
  getDeductionFraisLabel?: (type: string) => string;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ 
  conciergerie, 
  updateField, 
  isEditing = false,
  villes,
  getPropertyTypeLabel,
  getDeductionFraisLabel
}) => {
  // Generate alt text for logo
  const logoAltText = conciergerie.nom ? `Logo de ${conciergerie.nom}` : "Logo de conciergerie";

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={conciergerie.nom || ''}
              onChange={(e) => updateField && updateField('nom', e.target.value)}
              autoComplete="organization"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email de contact</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={conciergerie.mail || ''}
              onChange={(e) => updateField && updateField('mail', e.target.value)}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom du contact</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={conciergerie.nomContact || ''}
              onChange={(e) => updateField && updateField('nomContact', e.target.value)}
              autoComplete="off"
              data-lpignore="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone du contact</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={conciergerie.telephoneContact || ''}
              onChange={(e) => updateField && updateField('telephoneContact', e.target.value)}
              autoComplete="off"
              data-lpignore="true"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={conciergerie.logo || ''}
              onChange={(e) => updateField && updateField('logo', e.target.value)}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">Laissez vide si aucun logo</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Score manuel</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={conciergerie.scoreManuel ?? ''}
              onChange={(e) => updateField && updateField('scoreManuel', e.target.value === '' ? null : parseInt(e.target.value, 10))}
              placeholder="Utilise le score auto"
            />
            <p className="text-xs text-gray-500 mt-1">Laissez vide pour utiliser le score automatique. Un score négatif est possible.</p>
          </div>
          
          {/* Show villes covered with possibility to modify */}
          <div>
            <label className="block text-sm font-medium mb-1">Villes couvertes</label>
            <div className="mt-2 space-y-2">
              {conciergerie.villesIds && conciergerie.villesIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {conciergerie.villesIds.map((villeId) => {
                    const ville = villes?.get(villeId);
                    return (
                      <div 
                        key={villeId}
                        className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        <span>{ville?.nom || villeId}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-red-500"
                          onClick={() => {
                            if (updateField) {
                              // Remove this ville ID from the array
                              const updatedVillesIds = conciergerie.villesIds?.filter(id => id !== villeId) || [];
                              updateField('villesIds', updatedVillesIds);
                            }
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune ville sélectionnée</p>
              )}
            </div>

            {/* Add new ville dropdown */}
            {villes && villes.size > 0 && (
              <div className="mt-3">
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    if (e.target.value && updateField) {
                      const currentVillesIds = conciergerie.villesIds || [];
                      // Only add if not already in the array
                      if (!currentVillesIds.includes(e.target.value)) {
                        updateField('villesIds', [...currentVillesIds, e.target.value]);
                      }
                      // Reset select to default option
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Sélectionner une ville à ajouter</option>
                  {Array.from(villes.values()).map((ville) => (
                    <option 
                      key={ville.id} 
                      value={ville.id}
                      disabled={conciergerie.villesIds?.includes(ville.id)}
                    >
                      {ville.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type de logement accepté</label>
            <select
              className="w-full p-2 border rounded"
              value={conciergerie.typeLogementAccepte || 'tous'}
              onChange={(e) => updateField && updateField('typeLogementAccepte', e.target.value)}
            >
              <option value="standard">Standard / Milieu de gamme</option>
              <option value="luxe">Haut de gamme / Luxe</option>
              <option value="tous">Tous types de biens</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Superficie minimum (m²)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={conciergerie.superficieMin || 0}
              onChange={(e) => updateField && updateField('superficieMin', parseInt(e.target.value, 10))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre de chambres minimum</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={conciergerie.nombreChambresMin || 0}
              onChange={(e) => updateField && updateField('nombreChambresMin', parseInt(e.target.value, 10))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Déduction des frais</label>
            <select
              className="w-full p-2 border rounded"
              value={conciergerie.deductionFrais || 'inclus'}
              onChange={(e) => updateField && updateField('deductionFrais', e.target.value)}
            >
              <option value="deductTous">Tous les frais déductibles</option>
              <option value="deductMenage">Seulement les frais de ménage déductibles</option>
              <option value="inclus">Frais inclus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">TVA</label>
            <select
              className="w-full p-2 border rounded"
              value={typeof conciergerie.tva === 'string' ? conciergerie.tva : (conciergerie.tva ? 'TTC' : 'HT')}
              onChange={(e) => updateField && updateField('tva', e.target.value)}
            >
              <option value="">Non spécifié</option>
              <option value="TTC">TTC</option>
              <option value="HT">HT</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded"
              checked={conciergerie.accepteGestionPartielle || false}
              onChange={(e) => updateField && updateField('accepteGestionPartielle', e.target.checked)}
            />
            <label className="text-sm font-medium">Accepte la gestion partielle</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded"
              checked={conciergerie.accepteResidencePrincipale || false}
              onChange={(e) => updateField && updateField('accepteResidencePrincipale', e.target.checked)}
            />
            <label className="text-sm font-medium">Accepte les résidences principales</label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><span className="font-medium">Nom:</span> {conciergerie.nom}</p>
          <p><span className="font-medium">Email de contact:</span> {conciergerie.mail || ''}</p>
          <p><span className="font-medium">Nom du contact:</span> {conciergerie.nomContact || 'Non spécifié'}</p>
          <p><span className="font-medium">Téléphone du contact:</span> {conciergerie.telephoneContact || 'Non spécifié'}</p>
          <p><span className="font-medium">Score Final:</span> {conciergerie.score}</p>
          {conciergerie.scoreManuel != null && (
            <p className="text-sm text-gray-600">(Score manuel appliqué : {conciergerie.scoreManuel})</p>
          )}
          
          {conciergerie.logo ? (
            <div>
              <span className="font-medium">Logo:</span>
              <div className="mt-2 max-w-xs">
                <img
                  src={conciergerie.logo}
                  alt={logoAltText}
                  className="max-h-24 object-contain"
                  style={{
                    imageRendering: "-webkit-optimize-contrast"
                  }}
                />
              </div>
            </div>
          ) : (
            <p><span className="font-medium">Logo:</span> Aucun logo</p>
          )}
          
          {/* Display covered cities */}
          <div>
            <span className="font-medium">Villes couvertes:</span>
            <div className="mt-1">
              {conciergerie.villesIds && conciergerie.villesIds.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {conciergerie.villesIds.map((villeId) => {
                    const ville = villes?.get(villeId);
                    return (
                      <span key={villeId} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {ville?.nom || villeId}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Aucune ville spécifiée</span>
              )}
            </div>
          </div>
          
          <p><span className="font-medium">Type de logement accepté:</span> {getPropertyTypeLabel ? getPropertyTypeLabel(conciergerie.typeLogementAccepte) : conciergerie.typeLogementAccepte}</p>
          <p><span className="font-medium">Superficie minimum:</span> {conciergerie.superficieMin} m²</p>
          <p><span className="font-medium">Nombre de chambres minimum:</span> {conciergerie.nombreChambresMin}</p>
          <p><span className="font-medium">Déduction des frais:</span> {getDeductionFraisLabel ? getDeductionFraisLabel(conciergerie.deductionFrais || '') : conciergerie.deductionFrais}</p>
          <p><span className="font-medium">TVA:</span> {typeof conciergerie.tva === 'string' ? conciergerie.tva : (conciergerie.tva ? 'TTC' : 'HT')}</p>
          <p><span className="font-medium">Accepte la gestion partielle:</span> {conciergerie.accepteGestionPartielle ? 'Oui' : 'Non'}</p>
          <p><span className="font-medium">Accepte les résidences principales:</span> {conciergerie.accepteResidencePrincipale ? 'Oui' : 'Non'}</p>
        </div>
      )}
    </div>
  );
};

export default GeneralInfoSection;

