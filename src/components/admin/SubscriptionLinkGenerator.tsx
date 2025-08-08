"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui-kit/button";
import { Input } from "@/components/ui-kit/input";
import { Label } from "@/components/ui-kit/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui-kit/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-kit/card";

interface SubscriptionLinkGeneratorProps {
  conciergerieId: string;
  conciergerieName: string;
  displayMode?: 'card' | 'buttons';
}

const SubscriptionLinkGenerator: React.FC<SubscriptionLinkGeneratorProps> = ({
  conciergerieId,
  conciergerieName,
  displayMode = 'card',
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const subscriptionLink = `${window.location.origin}/subscription?conciergerieId=${conciergerieId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionLink);
      setCopied(true);
      toast({
        title: "Lien copiÃ©",
        description: "Le lien de souscription a Ã©tÃ© copiÃ© dans le presse-papiers",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const handleOpenLink = () => {
    window.open(subscriptionLink, '_blank');
  };

  if (displayMode === 'buttons') {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={handleCopyLink}
          size="sm"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>CopiÃ©</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copier le lien</span>
            </>
          )}
        </Button>
        <Button
          onClick={handleOpenLink}
          size="sm"
          aria-label="Ouvrir le lien de souscription"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Lien de souscription
        </CardTitle>
        <CardDescription>
          GÃ©nÃ©rez et partagez le lien de souscription pour {conciergerieName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`subscription-link-${conciergerieId}`}>Lien de souscription</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id={`subscription-link-${conciergerieId}`}
              value={subscriptionLink}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={handleCopyLink}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>CopiÃ©</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copier</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleOpenLink}
              aria-label="Ouvrir le lien de souscription"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Ce lien permet aux utilisateurs de s'abonner directement Ã  {conciergerieName}.</p>
          <p className="mt-1">Vous pouvez le partager via email, SMS ou l'intÃ©grer sur votre site web.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionLinkGenerator;

