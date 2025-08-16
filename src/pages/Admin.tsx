"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui-kit/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-kit/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui-kit/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-kit/card";
import { Button } from "@/components/ui-kit/button";
import { Badge } from "@/components/ui-kit/badge";
import { Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-kit/dialog";
import { getConciergeriesToValidate, getValidatedConciergeries, getAllVilles, getAllArticles, validateConciergerie, rejectConciergerie, addArticle, updateArticle, deleteArticle, addVille, updateVille, deleteVille, uploadImage, getAllImages, deleteImage, saveConciergerie, deleteConciergerie, getContactMessages, updateContactMessageStatus, deleteContactMessage, getAllSubscriptions } from "@/services/supabaseService";
import { getAllLeads } from "@/services/leadService";
import { supabase } from "@/integrations/supabase/client";
import { Conciergerie, Lead, Ville, Article, Formule } from "@/types";
import EditConciergerieForm from "@/components/admin/EditConciergerieForm";
import ArticleForm from "@/components/admin/ArticleForm";
import VilleForm from "@/components/admin/VilleForm";
import VillesManager from "@/components/admin/VillesManager";
import CityPopulator from "@/components/admin/CityPopulator";
import SubscriptionLinkGenerator from "@/components/admin/SubscriptionLinkGenerator";
import LeadDetailsDialog from "@/components/admin/LeadDetailsDialog";
import StarRating from "@/components/ui-kit/star-rating";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-kit/table";
const Admin = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // State for modals and forms
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingConciergerie, setEditingConciergerie] = useState<Conciergerie | undefined>();
  const [editingFormules, setEditingFormules] = useState<Formule[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [showVilleForm, setShowVilleForm] = useState(false);
  const [editingVille, setEditingVille] = useState<Ville | undefined>();

  // Lead details state
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();

  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-migration on component mount
  useEffect(() => {
    const performMigration = async () => {
      let movedFromLogosToImages = 0;
      let movedFromImagesToLogos = 0;
      const errors: string[] = [];
      try {
        // Get all files from conciergerie-logos bucket
        const {
          data: logosFiles,
          error: logosError
        } = await supabase.storage.from('conciergerie-logos').list('', {
          limit: 1000
        });
        if (logosError) {
          console.error("Error listing files from conciergerie-logos:", logosError);
          errors.push(`Erreur lors de la lecture du bucket conciergerie-logos: ${logosError.message}`);
        }

        // Get all files from images bucket
        const {
          data: imagesFiles,
          error: imagesError
        } = await supabase.storage.from('images').list('', {
          limit: 1000
        });
        if (imagesError) {
          console.error("Error listing files from images:", imagesError);
          errors.push(`Erreur lors de la lecture du bucket images: ${imagesError.message}`);
        }

        // Move files from conciergerie-logos to images (except actual logos)
        if (logosFiles) {
          for (const file of logosFiles) {
            if (file.name && !file.name.startsWith('.') && !file.name.toLowerCase().includes('logo')) {
              try {
                // Download file from conciergerie-logos
                const {
                  data: fileData,
                  error: downloadError
                } = await supabase.storage.from('conciergerie-logos').download(file.name);
                if (downloadError) {
                  errors.push(`Erreur lors du téléchargement de ${file.name}: ${downloadError.message}`);
                  continue;
                }

                // Upload to images bucket
                const {
                  error: uploadError
                } = await supabase.storage.from('images').upload(file.name, fileData, {
                  upsert: true
                });
                if (uploadError) {
                  errors.push(`Erreur lors de l'upload de ${file.name} vers images: ${uploadError.message}`);
                  continue;
                }

                // Delete from conciergerie-logos
                const {
                  error: deleteError
                } = await supabase.storage.from('conciergerie-logos').remove([file.name]);
                if (deleteError) {
                  errors.push(`Erreur lors de la suppression de ${file.name}: ${deleteError.message}`);
                  continue;
                }
                movedFromLogosToImages++;
                console.log(`Moved ${file.name} from conciergerie-logos to images`);
              } catch (error) {
                errors.push(`Erreur inattendue lors du déplacement de ${file.name}: ${error}`);
              }
            }
          }
        }

        // Move files from images/public to conciergerie-logos (these are likely logos)
        if (imagesFiles) {
          for (const file of imagesFiles) {
            if (file.name && !file.name.startsWith('.') && (file.name.toLowerCase().includes('logo') || file.name.toLowerCase().includes('public') || file.name.includes('/'))) {
              try {
                // Download file from images
                const {
                  data: fileData,
                  error: downloadError
                } = await supabase.storage.from('images').download(file.name);
                if (downloadError) {
                  errors.push(`Erreur lors du téléchargement de ${file.name}: ${downloadError.message}`);
                  continue;
                }

                // Clean filename for logos bucket
                const cleanFileName = file.name.replace(/^public\//, '') // Remove public/ prefix
                .replace(/[\/\\]/g, '_'); // Replace slashes with underscores

                // Upload to conciergerie-logos bucket
                const {
                  error: uploadError
                } = await supabase.storage.from('conciergerie-logos').upload(cleanFileName, fileData, {
                  upsert: true
                });
                if (uploadError) {
                  errors.push(`Erreur lors de l'upload de ${cleanFileName} vers conciergerie-logos: ${uploadError.message}`);
                  continue;
                }

                // Delete from images
                const {
                  error: deleteError
                } = await supabase.storage.from('images').remove([file.name]);
                if (deleteError) {
                  errors.push(`Erreur lors de la suppression de ${file.name}: ${deleteError.message}`);
                  continue;
                }
                movedFromImagesToLogos++;
                console.log(`Moved ${file.name} from images to conciergerie-logos as ${cleanFileName}`);
              } catch (error) {
                errors.push(`Erreur inattendue lors du déplacement de ${file.name}: ${error}`);
              }
            }
          }
        }
        if (movedFromLogosToImages > 0 || movedFromImagesToLogos > 0) {
          const totalMoved = movedFromLogosToImages + movedFromImagesToLogos;
          if (errors.length === 0) {
            toast({
              title: "Migration automatique terminée",
              description: `${totalMoved} fichiers déplacés avec succès`
            });
          } else {
            toast({
              title: "Migration automatique terminée avec des erreurs",
              description: `${totalMoved} fichiers déplacés, ${errors.length} erreurs`,
              variant: "destructive"
            });
          }
          console.log(`Migration completed: ${movedFromLogosToImages} moved to images, ${movedFromImagesToLogos} moved to logos`);
          if (errors.length > 0) {
            console.error("Migration errors:", errors);
          }
        }
      } catch (error) {
        console.error("Migration error:", error);
      }
    };
    performMigration();
  }, [toast]);

  // Queries
  const {
    data: conciergeriesToValidate = [],
    isLoading: loadingToValidate
  } = useQuery({
    queryKey: ["conciergeries-to-validate"],
    queryFn: getConciergeriesToValidate
  });
  const {
    data: validatedConciergeries = [],
    isLoading: loadingValidated
  } = useQuery({
    queryKey: ["validated-conciergeries"],
    queryFn: getValidatedConciergeries
  });
  const {
    data: leads = [],
    isLoading: loadingLeads
  } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: getAllLeads
  });
  const {
    data: villes = []
  } = useQuery({
    queryKey: ["villes"],
    queryFn: getAllVilles
  });
  const {
    data: articles = [],
    isLoading: loadingArticles
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getAllArticles
  });
  const {
    data: images = []
  } = useQuery({
    queryKey: ["images"],
    queryFn: getAllImages
  });
  const {
    data: contactMessages = [],
    isLoading: loadingContactMessages
  } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: getContactMessages
  });
  const {
    data: subscriptions = [],
    isLoading: loadingSubscriptions
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getAllSubscriptions
  });
  const {
    data: avis = [],
    isLoading: loadingAvis
  } = useQuery({
    queryKey: ["avis"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('avis').select(`
          *,
          conciergeries!inner(nom)
        `).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const unreadMessagesCount = contactMessages.filter(m => !m.is_read).length;

  // Mutations
  const validateMutation = useMutation({
    mutationFn: validateConciergerie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conciergeries-to-validate"]
      });
      queryClient.invalidateQueries({
        queryKey: ["validated-conciergeries"]
      });
      queryClient.invalidateQueries({
        queryKey: ["conciergeries"]
      });
      toast({
        title: "Conciergerie validée",
        description: "La conciergerie a été validée avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la validation",
        variant: "destructive"
      });
    }
  });
  const rejectMutation = useMutation({
    mutationFn: rejectConciergerie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conciergeries-to-validate"]
      });
      toast({
        title: "Conciergerie rejetée",
        description: "La conciergerie a été rejetée"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du rejet",
        variant: "destructive"
      });
    }
  });
  const saveConciergerieM = useMutation({
    mutationFn: saveConciergerie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conciergeries-to-validate"]
      });
      queryClient.invalidateQueries({
        queryKey: ["validated-conciergeries"]
      });
      queryClient.invalidateQueries({
        queryKey: ["conciergeries"]
      });
      setShowEditForm(false);
      setEditingConciergerie(undefined);
      setEditingFormules([]);
      toast({
        title: "Conciergerie sauvegardée",
        description: "Les modifications ont été enregistrées avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    }
  });
  const deleteConciergerieM = useMutation({
    mutationFn: deleteConciergerie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["validated-conciergeries"]
      });
      queryClient.invalidateQueries({
        queryKey: ["conciergeries"]
      });
      toast({
        title: "Conciergerie supprimée",
        description: "La conciergerie et ses données associées ont été supprimées avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  });
  const validateAvisMutation = useMutation({
    mutationFn: async (avisId: string) => {
      const {
        error
      } = await supabase.from('avis').update({
        valide: true
      }).eq('id', avisId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["avis"]
      });
      toast({
        title: "Avis validé",
        description: "L'avis a été validé avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la validation",
        variant: "destructive"
      });
    }
  });
  const rejectAvisMutation = useMutation({
    mutationFn: async (avisId: string) => {
      const {
        error
      } = await supabase.from('avis').delete().eq('id', avisId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["avis"]
      });
      toast({
        title: "Avis rejeté",
        description: "L'avis a été supprimé"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du rejet",
        variant: "destructive"
      });
    }
  });
  const updateMessageMutation = useMutation({
    mutationFn: ({
      id,
      status
    }: {
      id: string;
      status: {
        is_read?: boolean;
        is_processed?: boolean;
      };
    }) => updateContactMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-messages"]
      });
      toast({
        title: "Message mis à jour avec succès."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  const deleteMessageMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-messages"]
      });
      toast({
        title: "Message supprimé avec succès."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  const handleEditConciergerie = (conciergerie: Conciergerie) => {
    setEditingConciergerie(conciergerie);
    setEditingFormules(conciergerie.formules || []);
    setShowEditForm(true);
  };
  const handleSaveConciergerie = (conciergerieData: Conciergerie & {
    formules: Formule[];
  }) => {
    saveConciergerieM.mutate(conciergerieData);
  };
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingConciergerie(undefined);
    setEditingFormules([]);
  };

  // Article management functions
  const addArticleMutation = useMutation({
    mutationFn: addArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"]
      });
      setShowArticleForm(false);
      setEditingArticle(undefined);
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté avec succès"
      });
    }
  });
  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"]
      });
      setShowArticleForm(false);
      setEditingArticle(undefined);
      toast({
        title: "Article modifié",
        description: "L'article a été modifié avec succès"
      });
    }
  });
  const deleteArticleMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"]
      });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès"
      });
    }
  });
  const handleAddArticle = async (articleData: any) => {
    addArticleMutation.mutate(articleData);
  };
  const handleUpdateArticle = async (articleData: any) => {
    if (!editingArticle) return;
    const article = {
      ...editingArticle,
      ...articleData
    };
    updateArticleMutation.mutate(article);
  };
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowArticleForm(true);
  };

  // Lead details functions
  const handleViewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  // Ville management functions
  const addVilleMutation = useMutation({
    mutationFn: addVille,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["villes"]
      });
      setShowVilleForm(false);
      setEditingVille(undefined);
      toast({
        title: "Ville ajoutée",
        description: "La ville a été ajoutée avec succès"
      });
    }
  });
  const updateVilleMutation = useMutation({
    mutationFn: updateVille,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["villes"]
      });
      setShowVilleForm(false);
      setEditingVille(undefined);
      toast({
        title: "Ville modifiée",
        description: "La ville a été modifiée avec succès"
      });
    }
  });
  const deleteVilleMutation = useMutation({
    mutationFn: deleteVille,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["villes"]
      });
      toast({
        title: "Ville supprimée",
        description: "La ville a été supprimée avec succès"
      });
    }
  });
  const handleAddVille = async (villeData: Omit<Ville, "id">) => {
    await addVilleMutation.mutateAsync(villeData);
  };
  const handleUpdateVille = async (villeData: Ville) => {
    await updateVilleMutation.mutateAsync(villeData);
  };
  const handleDeleteVille = async (id: string) => {
    await deleteVilleMutation.mutateAsync(id);
  };


  // Image management functions
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, 'images'),
    // Use 'images' bucket for admin gallery
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"]
      });
      setIsUploading(false);
      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès"
      });
    },
    onError: () => {
      setIsUploading(false);
    }
  });
  const deleteImageMutation = useMutation({
    mutationFn: (fileName: string) => deleteImage(fileName),
    // Use 'images' bucket for admin gallery
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"]
      });
      setIsDeleting(false);
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès"
      });
    },
    onError: () => {
      setIsDeleting(false);
    }
  });
  const handleUploadImage = (file: File) => {
    setIsUploading(true);
    uploadImageMutation.mutate(file);
  };
  const handleDeleteImage = (fileName: string) => {
    setIsDeleting(true);
    deleteImageMutation.mutate(fileName);
  };


  const handleAddCities = () => {
    // This function receives the count of cities added and triggers a refresh
    queryClient.invalidateQueries({
      queryKey: ["villes"]
    });
  };
  const handleDeleteConciergerie = (id: string, nom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la conciergerie "${nom}" ? Cette action est irréversible et supprimera également toutes les formules associées.`)) {
      deleteConciergerieM.mutate(id);
    }
  };
  return <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Panneau d'administration</h1>
      
      <Tabs defaultValue="validation" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto min-w-full">
            <TabsTrigger value="validation" className="whitespace-nowrap">Validation</TabsTrigger>
            <TabsTrigger value="conciergeries" className="whitespace-nowrap">Conciergeries</TabsTrigger>
            <TabsTrigger value="leads" className="whitespace-nowrap">Leads</TabsTrigger>
            <TabsTrigger value="avis" className="whitespace-nowrap">Avis</TabsTrigger>
            <TabsTrigger value="messages" className="whitespace-nowrap">
              Messages
              {unreadMessagesCount > 0 && <Badge className="ml-2">{unreadMessagesCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="articles" className="whitespace-nowrap">Articles</TabsTrigger>
            <TabsTrigger value="villes" className="whitespace-nowrap">Villes</TabsTrigger>
            <TabsTrigger value="images" className="whitespace-nowrap">Images</TabsTrigger>
            <TabsTrigger value="subscriptions" className="whitespace-nowrap">Souscriptions</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Conciergeries en attente de validation</CardTitle>
              <CardDescription>
                Validez ou rejetez les nouvelles conciergeries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingToValidate ? <p>Chargement...</p> : conciergeriesToValidate.length === 0 ? <p>Aucune conciergerie en attente de validation</p> : conciergeriesToValidate.map(conciergerie => <div key={conciergerie.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{conciergerie.nom}</h3>
                        <p className="text-sm text-gray-600">{conciergerie.mail}</p>
                        <p className="text-sm">Zone: {conciergerie.zoneCouverte}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            Score: {conciergerie.score || 0}
                          </Badge>
                          {conciergerie.scoreManuel !== null && <Badge variant="secondary">
                              Score manuel défini: {conciergerie.scoreManuel}
                            </Badge>}
                          {conciergerie.scoreManuel === null && <Badge variant="outline">
                              Score automatique
                            </Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditConciergerie(conciergerie)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" onClick={() => validateMutation.mutate(conciergerie.id)} disabled={validateMutation.isPending}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(conciergerie.id)} disabled={rejectMutation.isPending}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conciergeries">
          <Card>
            <CardHeader>
              <CardTitle>Conciergeries validées</CardTitle>
              <CardDescription>
                Gérez les conciergeries validées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {validatedConciergeries.length} conciergeries validées
                </h3>
                <Button onClick={() => setShowEditForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une conciergerie
                </Button>
              </div>
              
              {loadingValidated ? <p>Chargement...</p> : validatedConciergeries.length === 0 ? <p>Aucune conciergerie validée</p> : validatedConciergeries.map(conciergerie => <div key={conciergerie.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{conciergerie.nom}</h3>
                        <p className="text-sm text-gray-600">{conciergerie.mail}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Score: {conciergerie.score}</Badge>
                          {conciergerie.scoreManuel !== null && <Badge variant="secondary">
                              Score manuel défini: {conciergerie.scoreManuel}
                            </Badge>}
                          {conciergerie.scoreManuel === null && <Badge variant="outline">
                              Score automatique
                            </Badge>}
                          <Badge variant={conciergerie.validated ? "default" : "secondary"}>
                            {conciergerie.validated ? "Validée" : "En attente"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditConciergerie(conciergerie)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteConciergerie(conciergerie.id, conciergerie.nom)} disabled={deleteConciergerieM.isPending}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    <div className="border-t my-4" />
                    <div className="flex justify-end">
                      <SubscriptionLinkGenerator conciergerieId={conciergerie.id} conciergerieName={conciergerie.nom} displayMode="buttons" />
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Consultez les demandes de devis reçues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingLeads ? <p>Chargement...</p> : leads.length === 0 ? <p>Aucun lead pour le moment</p> : leads.map(lead => <div key={lead.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{lead.nom}</h3>
                        <p className="text-sm text-gray-600">{lead.mail} - {lead.telephone}</p>
                        <p className="text-sm">Ville: {lead.ville}</p>
                        <p className="text-sm">Superficie: {lead.superficie}m² - {lead.nombreChambres} chambres</p>
                        {lead.message}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewLeadDetails(lead)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Badge variant="outline">
                          {lead.date ? new Date(lead.date as string).toLocaleDateString() : 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avis">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des avis</CardTitle>
              <CardDescription>
                Validez ou rejetez les avis soumis par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAvis ? <p>Chargement...</p> : avis.length === 0 ? <p>Aucun avis trouvé</p> : <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {avis.length} avis au total
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {avis.filter(a => a.valide).length} validés
                      </Badge>
                      <Badge variant="secondary">
                        {avis.filter(a => !a.valide).length} en attente
                      </Badge>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Conciergerie</TableHead>
                        <TableHead>0metteur</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Commentaire</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {avis.map(avisItem => <TableRow key={avisItem.id}>
                          <TableCell className="font-medium">
                            {avisItem.conciergeries?.nom || 'N/A'}
                          </TableCell>
                          <TableCell>{avisItem.emetteur}</TableCell>
                          <TableCell>
                            <StarRating rating={avisItem.note} size="sm" showNumber={false} />
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate">
                              {avisItem.commentaire || 'Aucun commentaire'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(avisItem.date || avisItem.created_at) ? new Date(avisItem.date || avisItem.created_at || '').toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={avisItem.valide ? "default" : "secondary"}>
                              {avisItem.valide ? "Validé" : "En attente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!avisItem.valide && <Button size="sm" onClick={() => validateAvisMutation.mutate(avisItem.id)} disabled={validateAvisMutation.isPending}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Valider
                                </Button>}
                              <Button size="sm" variant="destructive" onClick={() => rejectAvisMutation.mutate(avisItem.id)} disabled={rejectAvisMutation.isPending}>
                                <XCircle className="h-4 w-4 mr-1" />
                                {avisItem.valide ? "Supprimer" : "Rejeter"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages de contact</CardTitle>
              <CardDescription>
                Gérez les messages reçus depuis le formulaire de contact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingContactMessages ? <p>Chargement...</p> : contactMessages.length === 0 ? <p>Aucun message pour le moment.</p> : <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead className="hidden md:table-cell">Message</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactMessages.map(message => <TableRow key={message.id} className={!message.is_read ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <div className="font-medium">{message.nom}</div>
                          <div className="text-sm text-muted-foreground">{message.email}</div>
                        </TableCell>
                        <TableCell>{message.sujet}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-sm">
                          <p className="truncate">{message.message}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{new Date(message.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {message.is_processed ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Traité</Badge> : message.is_read ? <Badge variant="secondary">Lu</Badge> : <Badge>Nouveau</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {!message.is_read && !message.is_processed && <Button size="sm" variant="outline" onClick={() => updateMessageMutation.mutate({
                        id: message.id,
                        status: {
                          is_read: true
                        }
                      })}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Marquer comme lu</span>
                              </Button>}
                            {!message.is_processed && <Button size="sm" variant="outline" onClick={() => updateMessageMutation.mutate({
                        id: message.id,
                        status: {
                          is_read: true,
                          is_processed: true
                        }
                      })}>
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Marquer comme traité</span>
                              </Button>}
                            <Button size="sm" variant="destructive" onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) deleteMessageMutation.mutate(message.id);
                      }}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Gérez les articles du blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {articles.length} articles
                </h3>
                <Button onClick={() => setShowArticleForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un article
                </Button>
              </div>
              
              {loadingArticles ? <p>Chargement...</p> : articles.length === 0 ? <p>Aucun article</p> : articles.map(article => <div key={article.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{article.titre}</h3>
                        <p className="text-sm text-gray-600">{article.excerpt}</p>
                        <Badge variant="outline" className="mt-2">
                          {article.datePublication ? new Date(article.datePublication).toLocaleDateString() : 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditArticle(article)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteArticleMutation.mutate(article.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="villes">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des villes</CardTitle>
              <CardDescription>
                Gérez les villes disponibles sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VillesManager villes={villes || []} onAdd={handleAddVille} onUpdate={handleUpdateVille} onDelete={handleDeleteVille} />
              
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold mb-4">Ajouter plusieurs villes en masse</h4>
                <CityPopulator onCitiesAdded={handleAddCities} />
              </div>
              
              <SubscriptionLinkGenerator conciergerieId="example-id" conciergerieName="Exemple Conciergerie" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Galerie d'images</CardTitle>
              <CardDescription>
                Gérez les images téléchargées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {images?.length || 0} images
                  </h3>
                  <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleUploadImage(file);
                  }
                }} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload">
                    <Button asChild disabled={isUploading}>
                      <span>
                        <Plus className="h-4 w-4 mr-1" />
                        {isUploading ? "Téléchargement..." : "Télécharger une image"}
                      </span>
                    </Button>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images?.map(image => <div key={image.id} className="relative border rounded-lg overflow-hidden">
                      <img src={image.url} alt={image.name} className="w-full h-32 object-cover" />
                      <div className="p-2">
                        <p className="text-sm truncate">{image.name}</p>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.name)} disabled={isDeleting} className="mt-1 w-full">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Souscriptions</CardTitle>
              <CardDescription>
                Consultez les souscriptions des conciergeries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSubscriptions ? <p>Chargement...</p> : subscriptions.length === 0 ? <p>Aucune souscription pour le moment.</p> : <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conciergerie</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map(sub => <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.conciergerie_nom}</TableCell>
                        <TableCell>{sub.monthly_amount}</TableCell>
                        <TableCell>{sub.total_points}</TableCell>
                        <TableCell>
                          <Badge variant={sub.payment_status === 'completed' ? 'default' : sub.payment_status === 'pending' ? 'secondary' : 'destructive'}>
                            {sub.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                           <pre className="text-xs bg-gray-50 p-2 rounded">
                             {JSON.stringify({
                        basic_listing: sub.basic_listing,
                        partner_listing: sub.partner_listing,
                        phone_number: sub.phone_number,
                        website_link: sub.website_link,
                        backlink: sub.backlink,
                        conciergerie_page_link: sub.conciergerie_page_link
                      }, null, 2)}
                           </pre>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditConciergerieForm conciergerie={editingConciergerie} formules={editingFormules} onSave={handleSaveConciergerie} onCancel={handleCancelEdit} open={showEditForm} />

      <Dialog open={showArticleForm} onOpenChange={setShowArticleForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Modifier l'article" : "Ajouter un article"}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm article={editingArticle || null} onSave={editingArticle ? handleUpdateArticle : handleAddArticle} onCancel={() => {
          setShowArticleForm(false);
          setEditingArticle(undefined);
        }} />
        </DialogContent>
      </Dialog>

      <LeadDetailsDialog lead={selectedLead || null} open={showLeadDetails} onClose={() => {
      setShowLeadDetails(false);
      setSelectedLead(undefined);
    }} />

      {showVilleForm && <VilleForm ville={editingVille} allVilles={villes || []} onSave={editingVille ? handleUpdateVille : handleAddVille} onCancel={() => {
      setShowVilleForm(false);
      setEditingVille(undefined);
    }} open={showVilleForm} />}
    </div>;
};
export default Admin;

