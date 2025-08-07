"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Ville } from "@/types";

interface CitiesManagerProps {
  villes: Ville[];
  onDelete: (id: string) => void;
}

const CitiesManager: React.FC<CitiesManagerProps> = ({ villes, onDelete }) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting ville:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la ville",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {villes.length} villes disponibles
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Coordonnées</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {villes.map((ville) => (
              <TableRow key={ville.id}>
                <TableCell className="font-medium">{ville.nom}</TableCell>
                <TableCell>{ville.slug}</TableCell>
                <TableCell>
                  {ville.latitude && ville.longitude ? (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {ville.latitude.toFixed(4)}, {ville.longitude.toFixed(4)}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Non définies</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleDelete(ville.id)}
                    disabled={deletingId === ville.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {villes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Aucune ville disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CitiesManager;
