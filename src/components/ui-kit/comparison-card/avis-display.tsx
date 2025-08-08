"use client";

import React from "react";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "@/components/ui-kit/star-rating";

interface AvisDisplayProps {
  conciergerieId: string;
}

const AvisDisplay: React.FC<AvisDisplayProps> = ({ conciergerieId }) => {
  const [avis, setAvis] = React.useState<Array<{ id: string; emetteur: string; note: number; commentaire?: string }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("avis")
        .select("id, emetteur, note, commentaire")
        .eq("conciergerie_id", conciergerieId)
        .eq("valide", true);
      const normalized = (data || []).map((a: any) => ({
        id: a.id,
        emetteur: a.emetteur,
        note: a.note,
        commentaire: a.commentaire ?? undefined,
      }));
      setAvis(normalized);
      setLoading(false);
    };
    if (conciergerieId) load();
  }, [conciergerieId]);

  if (loading) return <div className="text-sm text-gray-500">Chargement des avis…</div>;

  if (avis.length === 0) return <div className="text-sm text-gray-500">Aucun avis disponible.</div>;

  return (
    <div className="space-y-3">
      {avis.map(a => (
        <div key={a.id} className="border rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{a.emetteur}</div>
            <StarRating rating={a.note} size="sm" />
          </div>
          {a.commentaire && <p className="text-sm mt-2">{a.commentaire}</p>}
        </div>
      ))}
    </div>
  );
};

export default AvisDisplay;

