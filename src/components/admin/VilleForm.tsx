"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-kit/button";
import { Input } from "@/components/ui-kit/input";
import { Label } from "@/components/ui-kit/label";
import { Textarea } from "@/components/ui-kit/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui-kit/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";
import { Badge } from "@/components/ui-kit/badge";
import { X } from "lucide-react";
import { useToast } from "@/components/ui-kit/use-toast";
import { Ville } from "@/types";

interface VilleFormProps {
  ville?: Ville;
  allVilles: Ville[];
  onSave: (ville: Ville) => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

const VilleForm: React.FC<VilleFormProps> = ({ ville, allVilles, onSave, onCancel, open }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Ville>>({
    nom: "",
    description: "",
    descriptionLongue: "",
    titleSeo: "",
    slug: "",
    latitude: null,
    longitude: null,
    departementNumero: "",
    departementNom: "",
    villeMereId: undefined,
    villesLiees: []
  });
  const [selectedVille, setSelectedVille] = useState<string>("none");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ville) {
      setFormData({
        id: ville.id,
        nom: ville.nom,
        description: ville.description,
        descriptionLongue: ville.descriptionLongue || '',
        titleSeo: ville.titleSeo,
        slug: ville.slug,
        latitude: ville.latitude,
        longitude: ville.longitude,
        departementNumero: ville.departementNumero || '',
        departementNom: ville.departementNom || '',
        villeMereId: ville.villeMereId || undefined,
        villesLiees: ville.villesLiees || []
      });
    } else {
      setFormData({
        nom: "",
        description: "",
        descriptionLongue: "",
        titleSeo: "",
        slug: "",
        latitude: null,
        longitude: null,
        departementNumero: "",
        departementNom: "",
        villeMereId: undefined,
        villesLiees: []
      });
    }
  }, [ville]);

  // Auto-generate slug from nom
  useEffect(() => {
    if (formData.nom && !ville) {
      const slug = formData.nom
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.nom, ville]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.slug) {
      toast({
        title: "Erreur",
        description: "Le nom et le slug sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await onSave(formData as Ville);
      toast({
        title: "Succès",
        description: ville ? "Ville modifiée avec succès" : "Ville ajoutée avec succès"
      });
      onCancel();
    } catch (error) {
      console.error("Error saving ville:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Ville, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVilleLiee = () => {
    if (selectedVille && selectedVille !== "none") {
      const villeToAdd = allVilles.find(v => v.id === selectedVille);
      if (villeToAdd && !formData.villesLiees?.includes(selectedVille)) {
        setFormData(prev => ({
          ...prev,
          villesLiees: [...(prev.villesLiees || []), selectedVille]
        }));
        setSelectedVille("none");
      }
    }
  };

  const removeVilleLiee = (villeId: string) => {
    setFormData(prev => ({
      ...prev,
      villesLiees: prev.villesLiees?.filter(id => id !== villeId) || []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ville ? "Modifier la ville" : "Ajouter une ville"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de la ville
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom || ""}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                placeholder="Nom de la ville"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="slug-de-la-ville"
                required
              />
            </div>

            <div>
              <Label htmlFor="departementNumero">Numéro de département</Label>
              <Input
                id="departementNumero"
                value={formData.departementNumero || ""}
                onChange={(e) => handleInputChange("departementNumero", e.target.value)}
                placeholder="75"
              />
            </div>

            <div>
              <Label htmlFor="departementNom">Nom du département</Label>
              <Input
                id="departementNom"
                value={formData.departementNom || ""}
                onChange={(e) => handleInputChange("departementNom", e.target.value)}
                placeholder="Paris"
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ""}
                onChange={(e) => handleInputChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="48.8566"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) => handleInputChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="2.3522"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description courte de la ville"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="descriptionLongue">Description longue</Label>
            <Textarea
              id="descriptionLongue"
              value={formData.descriptionLongue || ""}
              onChange={(e) => handleInputChange("descriptionLongue", e.target.value)}
              placeholder="Description détaillée de la ville"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="titleSeo">Titre SEO</Label>
            <Input
              id="titleSeo"
              value={formData.titleSeo || ""}
              onChange={(e) => handleInputChange("titleSeo", e.target.value)}
              placeholder="Titre optimisé pour le SEO"
            />
          </div>

          <div>
            <Label htmlFor="villeMereId">Ville mère</Label>
            <Select
              value={formData.villeMereId || "none"}
              onValueChange={(value) => handleInputChange("villeMereId", value === "none" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ville mère" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune ville mère</SelectItem>
                {allVilles
                  .filter(v => v.id !== ville?.id)
                  .map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.nom}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Villes liées</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={selectedVille} onValueChange={setSelectedVille}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sélectionner une ville</SelectItem>
                    {allVilles
                      .filter(v => v.id !== ville?.id && !formData.villesLiees?.includes(v.id))
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.nom}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addVilleLiee} disabled={selectedVille === "none"}>
                  Ajouter
                </Button>
              </div>

              {formData.villesLiees && formData.villesLiees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.villesLiees.map((villeId) => {
                    const villeLiee = allVilles.find(v => v.id === villeId);
                    return (
                      <Badge key={villeId} variant="secondary" className="flex items-center gap-1">
                        {villeLiee?.nom || villeId}
                        <button
                          type="button"
                          onClick={() => removeVilleLiee(villeId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : (ville ? "Modifier" : "Ajouter")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VilleForm;

