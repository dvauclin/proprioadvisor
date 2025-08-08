"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui-kit/button";
import { Input } from "@/components/ui-kit/input";
import { Textarea } from "@/components/ui-kit/textarea";
import StarRating from "@/components/ui-kit/star-rating";
import { addAvis } from "@/services/avisService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SimpleAvisFormProps {
  conciergerieId: string;
  onSuccess?: () => void;
}

export const SimpleAvisForm: React.FC<SimpleAvisFormProps> = ({ 
  conciergerieId, 
  onSuccess 
}) => {
  const [emetteur, setEmetteur] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emetteur.trim()) {
      toast.error("Veuillez indiquer votre nom");
      return;
    }
    
    if (note === 0) {
      toast.error("Veuillez donner une note");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addAvis({
        conciergerieId,
        emetteur: emetteur.trim(),
        note,
        commentaire: commentaire.trim()
      });

      if (result.success) {
        toast.success("Avis envoyÃ© !", {
          description: "Votre avis a Ã©tÃ© envoyÃ© et sera publiÃ© aprÃ¨s modÃ©ration."
        });
        
        // Reset form
        setEmetteur("");
        setNote(0);
        setCommentaire("");
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Erreur d'envoi", {
          description: result.error || "Une erreur est survenue lors de l'envoi de votre avis."
        });
      }
    } catch (error) {
      toast.error("Erreur d'envoi", {
        description: "Une erreur inattendue s'est produite. Veuillez rÃ©essayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="emetteur" className="block text-sm font-medium text-gray-700 mb-1">
          Votre nom
        </label>
        <Input
          id="emetteur"
          type="text"
          value={emetteur}
          onChange={(e) => setEmetteur(e.target.value)}
          placeholder="Votre nom"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <StarRating
          rating={note}
          onRatingChange={setNote}
          interactive={true}
          size="lg"
        />
      </div>

      <div>
        <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700 mb-1">
          Commentaire (optionnel)
        </label>
        <Textarea
          id="commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expÃ©rience..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        className="w-full btn-chartreuse"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer l'avis"
        )}
      </Button>
    </form>
  );
};

export default SimpleAvisForm;

