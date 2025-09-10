"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui-kit/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-kit/table";
import { Badge } from "@/components/ui-kit/badge";
import { Trash, Edit, MapPin, Plus } from "lucide-react";
import { useToast } from "@/components/ui-kit/use-toast";
import { Ville } from "@/types";
import VilleForm from "./VilleForm";

interface VillesManagerProps {
  villes: Ville[];
  onAdd: (ville: Ville) => Promise<void>;
  onUpdate: (ville: Ville) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const VillesManager: React.FC<VillesManagerProps> = ({ villes, onAdd, onUpdate, onDelete }) => {
  const { toast } = useToast();
  const [editingVille, setEditingVille] = useState<Ville | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleEdit = (ville: Ville) => {
    setEditingVille(ville);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingVille(null);
    setShowForm(true);
  };

  const handleSave = async (ville: Ville) => {
    try {
      if (editingVille) {
        await onUpdate(ville);
        toast({
          title: "Ville modifiée",
          description: `La ville "${ville.nom}" a été modifiée avec succès`,
        });
      } else {
        await onAdd(ville);
        toast({
          title: "Ville ajoutée",
          description: `La ville "${ville.nom}" a été ajoutée avec succès`,
        });
      }
      setShowForm(false);
      setEditingVille(null);
    } catch (error) {
      console.error("Error saving ville:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, nom: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
      toast({
        title: "Ville supprimée",
        description: `La ville "${nom}" a été supprimée avec succès`,
      });
    } catch (error) {
      console.error("Error deleting ville:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };





  const getVilleMereNom = (villeMereId: string) => {
    const villeMere = villes.find(v => v.id === villeMereId);
    return villeMere?.nom || villeMereId;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Gestion des villes</h3>
          <p className="text-sm text-gray-600">Ajoutez, modifiez ou supprimez des villes</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une ville
        </Button>
      </div>

      {showForm && (
        <VilleForm
          ville={editingVille || undefined}
          allVilles={villes}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingVille(null);
          }}
          open={showForm}
        />
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Ville mère</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {villes.map((ville) => (
              <TableRow key={ville.id}>
                <TableCell className="font-medium">{ville.nom}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {ville.departementNumero} - {ville.departementNom}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ville.villeMereId ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {getVilleMereNom(ville.villeMereId)}
                    </div>
                  ) : (
                    <span className="text-gray-400">Aucune</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ville)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ville.id, ville.nom)}
                      disabled={deletingId === ville.id}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VillesManager;

