"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createConciergerieSlug } from "@/utils/conciergerieUtils";
interface BacklinkInfoDialogProps {
  conciergerieId: string | null;
}
export const BacklinkInfoDialog: React.FC<BacklinkInfoDialogProps> = ({
  conciergerieId
}) => {
  const {
    toast
  } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [conciergerieData, setConciergerieData] = useState<any>(null);
  const [villesData, setVillesData] = useState<any[]>([]);
  useEffect(() => {
    if (conciergerieId) {
      fetchConciergerieData();
    }
  }, [conciergerieId]);
  const fetchConciergerieData = async () => {
    if (!conciergerieId) return;
    try {
      // Fetch conciergerie data
      const {
        data: conciergerie,
        error: conciergerieError
      } = await supabase.from('conciergeries').select('nom, villes_ids').eq('id', conciergerieId).single();
      if (conciergerieError) throw conciergerieError;
      setConciergerieData(conciergerie);

      // Fetch villes data if villes_ids exists
      if (conciergerie.villes_ids && conciergerie.villes_ids.length > 0) {
        const {
          data: villes,
          error: villesError
        } = await supabase.from('villes').select('nom, slug').in('id', conciergerie.villes_ids);
        if (villesError) throw villesError;
        setVillesData(villes || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      toast({
        title: "Lien copié",
        description: `Le lien ${label} a été copié dans le presse-papiers`
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };
  const homePageUrl = "https://proprioadvisor.fr";
  const detailPageUrl = conciergerieData ? `https://proprioadvisor.fr/conciergerie-details/${createConciergerieSlug(conciergerieData.nom)}` : "";
  return <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto px-[2px] py-[2px]">
          <Info className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Conditions pour le lien partenaire</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Éligibilité</h3>
            <p className="text-blue-700">
              Vous êtes éligible uniquement si vous possédez un site web.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Instructions de placement</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Vous devez placer un lien partenaire sur la page d'accueil de votre site web</li>
              <li>Ce lien peut être réalisé soit sur le logo Proprioadvisor soit sur du texte (ex: "Proprioadvisor")</li>
              <li>Le lien doit mener vers l'une des pages suivantes :</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Liens disponibles</h3>
            
            {/* Page d'accueil */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <p className="font-medium">Page d'accueil</p>
                <p className="text-sm text-gray-600 break-all">{homePageUrl}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(homePageUrl, "page d'accueil")} className="ml-2 flex-shrink-0">
                {copiedUrl === homePageUrl ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Pages listings par ville */}
            {villesData.length > 0 && <div>
                {villesData.map(ville => {
              const listingUrl = `https://proprioadvisor.fr/conciergerie/${ville.slug}`;
              return <div key={ville.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded border mb-2">
                      <div>
                        <p className="font-medium">{ville.nom}</p>
                        <p className="text-sm text-gray-600 break-all">{listingUrl}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(listingUrl, `listing ${ville.nom}`)} className="ml-2 flex-shrink-0">
                        {copiedUrl === listingUrl ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>;
            })}
              </div>}

            {/* Page détail */}
            {detailPageUrl && <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <p className="font-medium">Page détails de votre conciergerie</p>
                  <p className="text-sm text-gray-600 break-all">{detailPageUrl}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(detailPageUrl, "page détail")} className="ml-2 flex-shrink-0">
                  {copiedUrl === detailPageUrl ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <strong>Note :</strong> Une vérification automatique sera effectuée tous les mois pour s'assurer que le lien est toujours présent sur votre page d'accueil.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};