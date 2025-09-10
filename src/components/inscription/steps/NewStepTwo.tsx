"use client";

import React, { useState } from "react";
import { FormuleFormData } from "@/components/formule/FormuleFormSchema";
import FormuleForm from "@/components/formule/FormuleForm";
import { Button } from "@/components/ui-kit/button";
import { ListPlus, ArrowLeft, ArrowRight, Trash2, Edit, Package } from "lucide-react";

interface NewStepTwoProps {
  formules: FormuleFormData[];
  onAddFormule: (data: FormuleFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  onBack: () => void;
  onDeleteFormule: (index: number) => void;
  onEditFormule?: (index: number, formule: FormuleFormData) => void;
  submitText?: string;
}

const NewStepTwo: React.FC<NewStepTwoProps> = ({
  formules,
  onAddFormule,
  onSubmit,
  loading,
  onBack,
  onDeleteFormule,
  onEditFormule,
  submitText = "Continuer"
}) => {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingFormule, setEditingFormule] = useState<{
    index: number;
    formule: FormuleFormData;
  } | null>(null);

  // Vérification de sécurité pour formules
  const safeFormules = Array.isArray(formules) ? formules : [];
  const formulesCount = safeFormules.length;

  const handleOpenFormDialog = (formule?: FormuleFormData, index?: number) => {
    if (formule && index !== undefined && onEditFormule) {
      setEditingFormule({
        index,
        formule
      });
    } else {
      setEditingFormule(null);
    }
    setFormDialogOpen(true);
  };

  const handleFormSubmit = (data: FormuleFormData) => {
    if (editingFormule && onEditFormule) {
      onEditFormule(editingFormule.index, data);
    } else {
      onAddFormule(data);
    }
    setFormDialogOpen(false);
    setEditingFormule(null);
  };

  const handleCloseDialog = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) {
      setEditingFormule(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quelles sont vos offres et services ?
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Package className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Gérer les formules</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Vous avez ajouté {formulesCount} formule(s). Veuillez ajouter au moins une formule.
        </p>

        {formulesCount > 0 && (
          <div className="mb-6 space-y-3">
            <h4 className="font-medium text-gray-900">Formules ajoutées :</h4>
            <div className="space-y-3">
              {safeFormules.map((formule, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{formule.nom}</p>
                    <p className="text-sm text-gray-600">
                      Commission : {formule.commission}% | 
                      Durée min : {formule.dureeGestionMin === 0 ? "Aucun engagement" : `${formule.dureeGestionMin} mois`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {onEditFormule && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenFormDialog(formule, index)}
                        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                        title="Modifier cette formule"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier la formule</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFormule(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      title="Supprimer cette formule"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer la formule</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mb-6" 
          onClick={() => handleOpenFormDialog()}
        >
          <ListPlus className="mr-2 h-4 w-4" />
          Ajouter une formule
        </Button>
      </div>

      <FormuleForm 
        open={formDialogOpen} 
        onOpenChange={handleCloseDialog} 
        onSubmit={handleFormSubmit} 
        formuleData={editingFormule?.formule} 
      />

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} disabled={loading} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <Button onClick={onSubmit} disabled={formulesCount === 0 || loading} className="flex items-center">
          {loading ? "Envoi en cours..." : submitText}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default NewStepTwo;
