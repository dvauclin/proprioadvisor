"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { addAvis } from '@/services/avisService';
import { toast } from 'sonner';

interface AddAvisModalProps {
  isOpen: boolean;
  onClose: () => void;
  conciergerieId: string;
  conciergerieName: string;
  onAvisAdded: () => void;
}

const AddAvisModal: React.FC<AddAvisModalProps> = ({
  isOpen,
  onClose,
  conciergerieId,
  conciergerieName,
  onAvisAdded
}) => {
  const [emetteur, setEmetteur] = useState('');
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!conciergerieId || conciergerieId.trim() === '') {
      toast.error('❌ Erreur: Identifiant de conciergerie manquant');
      console.error('🚨 conciergerieId is missing or empty:', conciergerieId);
      return;
    }

    if (!emetteur.trim()) {
      toast.error('⚠️ Veuillez saisir votre nom');
      return;
    }

    if (note === 0) {
      toast.error('⚠️ Veuillez donner une note');
      return;
    }

    if (note < 1 || note > 5) {
      toast.error('⚠️ La note doit être comprise entre 1 et 5');
      return;
    }

    console.log('📋 Données du formulaire avant soumission:', {
      conciergerieId,
      emetteur: emetteur.trim(),
      note,
      commentaire: commentaire.trim(),
      conciergerieName
    });

    setIsSubmitting(true);
    try {
      const result = await addAvis({
        conciergerieId: conciergerieId,
        emetteur: emetteur.trim(),
        note,
        commentaire: commentaire.trim()
      });

      if (result.success) {
        toast.success('🎉 Votre avis a été soumis et sera examiné avant publication');
        setEmetteur('');
        setNote(0);
        setCommentaire('');
        onClose();
        onAvisAdded();
      } else {
        console.error('❌ Échec de l\'ajout d\'avis:', result.error);
        toast.error(`❌ ${result.error || 'Erreur lors de l\'envoi de votre avis'}`);
      }
    } catch (error) {
      console.error('💥 Erreur lors de la soumission de l\'avis:', error);
      toast.error('💥 Erreur inattendue lors de l\'envoi de votre avis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmetteur('');
    setNote(0);
    setCommentaire('');
    setHoveredStar(0);
    onClose();
  };

  // Vérification de sécurité : si conciergerieId est manquant, afficher une erreur
  if (!conciergerieId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>
              Impossible de charger le formulaire d'avis. L'identifiant de la conciergerie est manquant.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un avis pour {conciergerieName}</DialogTitle>
          <DialogDescription>
            Partagez votre expérience avec cette conciergerie. Votre avis sera examiné avant publication.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emetteur">Votre nom *</Label>
            <Input
              id="emetteur"
              value={emetteur}
              onChange={(e) => setEmetteur(e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <Label>Note *</Label>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    index < (hoveredStar || note)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                  onClick={() => setNote(index + 1)}
                  onMouseEnter={() => setHoveredStar(index + 1)}
                  onMouseLeave={() => setHoveredStar(0)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="commentaire">Commentaire</Label>
            <Textarea
              id="commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !emetteur.trim() || note === 0}
              className=""
            >
              {isSubmitting ? '📤 Envoi...' : '📝 Publier l\'avis'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAvisModal;
