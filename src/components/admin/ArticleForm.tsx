"use client";

import React, { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Textarea } from "@/components/ui-kit/textarea";
import { Button } from "@/components/ui-kit/button";
import { DialogFooter } from "@/components/ui-kit/dialog";
import { useToast } from "@/components/ui-kit/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { uploadImage } from "@/services/supabaseService";
import { Article } from "@/types";
import { Separator } from "@/components/ui-kit/separator";
import { supabase } from "@/integrations/supabase/client";

interface ArticleFormProps {
  article: Article | null;
  onSave: (data: z.infer<typeof articleSchema>) => Promise<void>;
  onCancel?: () => void;
}

const articleSchema = z.object({
  titre: z.string().min(1, "Titre requis"),
  slug: z.string().min(1, "Slug requis"),
  contenu: z.string().min(1, "Contenu requis"),
  excerpt: z.string().min(1, "Extrait requis"),
  image: z.string().optional(),
  datePublication: z.string().min(1, "Date de publication requise"),
  resume: z.string().optional(),
  question_1: z.string().optional(),
  reponse_1: z.string().optional(),
  question_2: z.string().optional(),
  reponse_2: z.string().optional(),
  question_3: z.string().optional(),
  reponse_3: z.string().optional(),
  question_4: z.string().optional(),
  reponse_4: z.string().optional(),
  question_5: z.string().optional(),
  reponse_5: z.string().optional(),
});

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave, onCancel }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const extendedArticle = article as any;
  const [imagePreview, setImagePreview] = useState<string | null>(extendedArticle?.image || null);
  
  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      titre: extendedArticle?.titre || "",
      slug: extendedArticle?.slug || "",
      contenu: extendedArticle?.contenu || "",
      excerpt: extendedArticle?.excerpt || "",
      image: extendedArticle?.image || "",
      datePublication: extendedArticle?.datePublication 
        ? new Date(extendedArticle.datePublication).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      resume: extendedArticle?.resume || "",
      question_1: extendedArticle?.question_1 || "",
      reponse_1: extendedArticle?.reponse_1 || "",
      question_2: extendedArticle?.question_2 || "",
      reponse_2: extendedArticle?.reponse_2 || "",
      question_3: extendedArticle?.question_3 || "",
      reponse_3: extendedArticle?.reponse_3 || "",
      question_4: extendedArticle?.question_4 || "",
      reponse_4: extendedArticle?.reponse_4 || "",
      question_5: extendedArticle?.question_5 || "",
      reponse_5: extendedArticle?.reponse_5 || "",
    }
  });

  // Fonction pour mettre à jour l'article en temps réel
  const updateArticleRealtime = async (field: string, value: string) => {
    if (!extendedArticle?.id) return;
    
    try {
      setIsRealtimeActive(true);
      
      const { error } = await supabase
        .from('articles')
        .update({ [field]: value })
        .eq('id', extendedArticle.id);
      
      if (error) {
        console.error('Erreur mise à jour temps réel:', error);
      }
    } catch (error) {
      console.error('Erreur mise à jour temps réel:', error);
    } finally {
      // Désactiver l'indicateur après un délai
      setTimeout(() => setIsRealtimeActive(false), 1000);
    }
  };

  // Écouter les changements de formulaire pour les mises à jour en temps réel
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && extendedArticle?.id) {
        // Mettre à jour en temps réel pour les champs principaux et FAQ
        const realtimeFields = [
          'titre', 'contenu', 'excerpt', 'resume',
          'question_1', 'reponse_1', 'question_2', 'reponse_2',
          'question_3', 'reponse_3', 'question_4', 'reponse_4',
          'question_5', 'reponse_5'
        ];
        if (realtimeFields.includes(name)) {
          updateArticleRealtime(name, value[name] || '');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, extendedArticle?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Afficher une prévisualisation temporaire
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload vers Supabase
      const result = await uploadImage(file, 'images');
      
      if (result.success && result.url) {
        form.setValue("image", result.url);
        // Mettre à jour l'image en temps réel
        if (extendedArticle?.id) {
          updateArticleRealtime('image', result.url);
        }
        toast({
          title: "Image téléchargée",
          description: "L'image a été téléchargée avec succès",
        });
      } else {
        setImagePreview(null);
        toast({
          title: "Erreur",
          description: result.error || "Impossible de télécharger l'image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setImagePreview(null);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof articleSchema>) => {
    try {
      await onSave(data);
      toast({
        title: "Succès",
        description: article ? "Article modifié avec succès" : "Article ajouté avec succès",
      });
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicateur de mise à jour en temps réel */}
      {isRealtimeActive && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Wifi className="h-4 w-4 text-blue-600 animate-pulse" />
          <span className="text-sm text-blue-700 font-medium">
            ✓ Mise à jour en temps réel active - Les changements sont appliqués instantanément
          </span>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'article" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-de-larticle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extrait *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Résumé court de l'article" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Image de l'article</FormLabel>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Téléchargement en cours...
                </div>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="datePublication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de publication *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contenu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Contenu de l'article (HTML autorisé)" 
                    rows={10}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Résumé détaillé</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Résumé détaillé de l'article" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">FAQ (optionnel)</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`question_${num}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question {num}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Question ${num}`} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`reponse_${num}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder={`Réponse ${num}`} 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            {onCancel && (
              <Button type="button" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={uploading}>
              {uploading ? "Téléchargement..." : (article ? "Modifier" : "Ajouter")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;

