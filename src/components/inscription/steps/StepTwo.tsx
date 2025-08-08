"use client";

import React, { useState } from "react";
import { FormuleFormData } from "@/components/formule/FormuleFormSchema";
import FormuleForm from "@/components/formule/FormuleForm";
import { Button } from "@/components/ui-kit/button";
import { ListPlus, ArrowLeft, Trash2, Edit } from "lucide-react";

interface StepTwoProps {
  formules: FormuleFormData[];
  onAddFormule: (data: FormuleFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  onBack: () => void;
  onDeleteFormule: (index: number) => void;
  onEditFormule?: (index: number, formule: FormuleFormData) => void;
  submitText?: string;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formules,
  onAddFormule,
  onSubmit,
  loading,
  onBack,
  onDeleteFormule,
  onEditFormule,
  submitText = "Finaliser l'inscription"
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
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ListPlus className="mr-2 h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold">
            Gérer les formules
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Vous avez ajouté {formulesCount} formule(s). Veuillez ajouter au moins une formule.
        </p>

        {formulesCount > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="font-medium">Formules ajoutées :</h3>
            <div className="space-y-2">
              {safeFormules.map((formule, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formule.nom}</p>
                    <p className="text-sm text-gray-600">
                      Commission : {formule.commission}% | 
                      Durée min : {formule.dureeGestionMin} mois
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
      </div>

      <Button variant="outline" className="w-full mb-6" onClick={() => handleOpenFormDialog()}>
        <ListPlus className="mr-2 h-4 w-4" />
        Ajouter une formule
      </Button>

      <FormuleForm 
        open={formDialogOpen} 
        onOpenChange={handleCloseDialog} 
        onSubmit={handleFormSubmit} 
        formuleData={editingFormule?.formule} 
      />
      
      <div className="flex justify-between pt-6 border-t mt-8">
        <Button variant="outline" onClick={onBack} disabled={loading} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <Button onClick={onSubmit} disabled={formulesCount === 0 || loading}>
          {loading ? "Envoi en cours..." : submitText}
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
