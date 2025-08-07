
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avis } from '@/types';
import StarRating from './StarRating';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AvisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAvis: () => void;
  avis: Avis[];
  conciergerieName: string;
}

const generateRandomDate = (): Date => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const randomTime = oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime());
  return new Date(randomTime);
};

const AvisModal: React.FC<AvisModalProps> = ({
  isOpen,
  onClose,
  onAddAvis,
  avis,
  conciergerieName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col bg-white z-50">
        <DialogHeader>
          <DialogTitle>Avis pour {conciergerieName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {avis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun avis disponible pour cette conciergerie.</p>
              <Button onClick={onAddAvis}>
                Laisser le premier avis
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold">
                  {avis.length} avis
                </h3>
                <Button 
                  onClick={onAddAvis}
                  variant="outline"
                  size="sm"
                >
                  Ajouter un avis
                </Button>
              </div>
              
              <div className="space-y-4">
                {avis.map((avisItem) => {
                  let displayDate: Date;
                  
                  if (!avisItem.date) {
                    displayDate = generateRandomDate();
                  } else {
                    displayDate = new Date(avisItem.date);
                    if (isNaN(displayDate.getTime())) {
                      displayDate = generateRandomDate();
                    }
                  }

                  return (
                    <div key={avisItem.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{avisItem.emetteur}</p>
                          <StarRating rating={avisItem.note} size="sm" />
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(displayDate, 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      {avisItem.commentaire && (
                        <p className="text-gray-700 mt-2">{avisItem.commentaire}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvisModal;
