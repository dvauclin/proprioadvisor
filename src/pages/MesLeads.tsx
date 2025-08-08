import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getLeads, markLeadAsViewed } from '@/services/leadService';
import { Loader2, Calendar, MapPin, Phone, Mail, User, Home, MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Badge } from '@/components/ui-kit/badge';
import { Button } from '@/components/ui-kit/button';
import { toast } from 'sonner';
import { Lead } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MesLeadsProps {
  user: SupabaseUser | null;
  authLoading?: boolean;
}

const MesLeads: React.FC<MesLeadsProps> = ({ user, authLoading = false }) => {
  const { data: leads, isLoading: leadsLoading, error, refetch } = useQuery({
    queryKey: ['my-leads', user?.email],
    queryFn: getLeads,
    enabled: !!user?.email,
    staleTime: 0,
    gcTime: 0
  });

  const markAsViewedMutation = useMutation({
    mutationFn: markLeadAsViewed,
    onSuccess: () => {
      refetch();
      toast.success("Lead marquÃ© comme vu", {
        description: "Votre rÃ©activitÃ© contribue Ã  amÃ©liorer votre visibilitÃ© !"
      });
    },
    onError: (error: any) => {
      toast.error("Erreur", {
        description: error.message || "Impossible de marquer le lead comme vu"
      });
    }
  });

  const handleMarkAsViewed = (leadId: string) => {
    markAsViewedMutation.mutate(leadId);
  };

  const isLoading = authLoading || leadsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Erreur lors du chargement de vos leads :</p>
            <p className="text-red-500 mt-2">{(error as any).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mes Leads</CardTitle>
            <CardDescription>
              Aucun lead reÃ§u pour le moment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLogementLabel = (type: 'standard' | 'luxe') => {
    return type === 'luxe' ? 'Logement de luxe' : 'Logement standard';
  };

  const getDureeLabel = (duree: 'moins3mois' | '3a6mois' | '6a12mois' | 'plus1an') => {
    switch (duree) {
      case 'moins3mois':
        return 'Moins de 3 mois';
      case '3a6mois':
        return '3 Ã  6 mois';
      case '6a12mois':
        return '6 Ã  12 mois';
      case 'plus1an':
        return 'Plus d\'1 an';
      default:
        return duree;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Leads</h1>
          <p className="text-muted-foreground mt-2">
            {leads.length} lead{leads.length > 1 ? 's' : ''} reÃ§u{leads.length > 1 ? 's' : ''}
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-base">
              ðŸ’¡ <strong>Astuce :</strong> Marquez vos leads comme "vus" le plus rapidement possible pour faire partie des conciergeries les plus rÃ©actives et obtenir un boost de visibilitÃ© !
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {leads.map((lead: Lead) => (
            <Card key={lead.id} className={`border-l-4 ${lead.dateVue ? 'border-l-green-500' : 'border-l-primary'}`}>
              <CardHeader className="pb-4">
                {/* Mobile Layout */}
                <div className="block md:hidden space-y-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {lead.nom}
                    {lead.dateVue && <Eye className="h-4 w-4 text-green-600" />}
                  </CardTitle>
                  
                  {lead.formuleNom && (
                    <div>
                      <Badge variant="secondary">{lead.formuleNom}</Badge>
                    </div>
                  )}
                  
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    ReÃ§u le {lead.date ? formatDate(lead.date) : 'Date inconnue'}
                  </CardDescription>
                  
                  <div className="pt-2">
                    {!lead.dateVue ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkAsViewed(lead.id)} 
                        disabled={markAsViewedMutation.isPending} 
                        className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Marquer comme vu
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-700 border-green-200 py-2">
                        <Eye className="h-4 w-4 mr-1" />
                        Vu le {formatDate(lead.dateVue)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {lead.nom}
                      {lead.dateVue && <Eye className="h-4 w-4 text-green-600" />}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      ReÃ§u le {lead.date ? formatDate(lead.date) : 'Date inconnue'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.formuleNom && (
                      <Badge variant="secondary">
                        {lead.formuleNom}
                      </Badge>
                    )}
                    {!lead.dateVue ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkAsViewed(lead.id)} 
                        disabled={markAsViewedMutation.isPending} 
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Marquer comme vu
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        <Eye className="h-4 w-4 mr-1" />
                        Vu le {formatDate(lead.dateVue)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.mail}</span>
                  </div>
                  {lead.plusieursLogements && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>Plusieurs logements</span>
                    </div>
                  )}
                  {lead.residencePrincipale && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>RÃ©sidence principale</span>
                    </div>
                  )}
                </div>

                {/* Adresse */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.adresse}, {lead.ville}</span>
                </div>

                {/* PropriÃ©tÃ©s du bien */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Surface</span>
                    <div className="font-medium">{lead.superficie} mÂ²</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Chambres</span>
                    <div className="font-medium">{lead.nombreChambres}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Type</span>
                    <div className="font-medium">{getTypeLogementLabel(lead.typeBien)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">DurÃ©e</span>
                    <div className="font-medium">{getDureeLabel(lead.dureeEspacementDisposition)}</div>
                  </div>
                </div>

                {/* Services recherchÃ©s */}
                {lead.prestationsRecherchees && lead.prestationsRecherchees.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Services recherchÃ©s</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lead.prestationsRecherchees.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {lead.message && !lead.message.toLowerCase().includes('demande de devis multiple') && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesLeads;

