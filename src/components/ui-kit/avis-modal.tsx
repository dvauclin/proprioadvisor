
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { Avis } from '@/types';
import StarRating from '@/components/ui-kit/star-rating';
import { format } from 'date-fns/format';
import { fr } from 'date-fns/locale/fr';

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
  // Memorize computed display dates per avis id so they don't change on re-render
  const displayDateMapRef = React.useRef<Record<string, Date>>({});

  React.useEffect(() => {
    if (!avis || avis.length === 0) return;
    const map = displayDateMapRef.current;
    for (const avisItem of avis) {
      if (!map[avisItem.id]) {
        let computed: Date;
        if (!avisItem.date) {
          computed = generateRandomDate();
        } else {
          const parsed = new Date(avisItem.date);
          computed = isNaN(parsed.getTime()) ? generateRandomDate() : parsed;
        }
        map[avisItem.id] = computed;
      }
    }
  }, [avis]);

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
                  const displayDate = displayDateMapRef.current[avisItem.id] || new Date();
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

