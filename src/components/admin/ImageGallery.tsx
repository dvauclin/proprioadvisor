"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-kit/button";
import { Input } from "@/components/ui-kit/input";
import { Label } from "@/components/ui-kit/label";
import { useToast } from "@/components/ui-kit/use-toast";
import { UploadCloud, Copy, X, Loader2 } from "lucide-react";
import { uploadImage, getAllImages, deleteImage } from "@/services/supabaseService";

interface ImageFile {
  name: string;
  url: string;
  id: string;
}

const ImageGallery: React.FC = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      console.log("Fetching images from 'images' bucket...");
      const fetchedImages = await getAllImages();
      console.log("Fetched images:", fetchedImages);
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Erreur",
            description: `${file.name} dépasse la taille maximale de 5MB`,
            variant: "destructive",
          });
          continue;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erreur",
            description: `${file.name} n'est pas un fichier image valide`,
            variant: "destructive",
          });
          continue;
        }
        
        console.log("Starting upload for file:", file.name, "size:", file.size, "type:", file.type);
        
        // Upload the file to Supabase Storage 'images' bucket
        const result = await uploadImage(file, 'images');
        
        if (result.success && result.url) {
          console.log("Upload successful:", { name: result.name, url: result.url, path: result.path });
          
          toast({
            title: "Image téléchargée",
            description: `${file.name} a été téléchargée avec succès`,
          });
          
          // Refresh the images list to get the latest state
          await fetchImages();
        } else {
          setUploadError(result.error || "Une erreur inconnue est survenue");
          console.error("Upload failed:", result.error);
          toast({
            title: "Erreur",
            description: `Impossible de télécharger ${file.name}: ${result.error || "Erreur inconnue"}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadError("Une erreur inconnue est survenue");
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteImage(id);
      toast({
        title: "Image supprimée",
        description: `${name} a été supprimée avec succès`,
      });
      // Refresh the images list
      await fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL de l'image a été copiée dans le presse-papiers",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Galerie d'images</h3>
        <p className="text-sm text-gray-600 mb-4">
          Téléchargez et gérez les images pour votre site
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Télécharger des images
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PNG, JPG, GIF jusqu'à 5MB
              </span>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Téléchargement en cours...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.alt = 'Image non disponible';
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{image.name}</p>
              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyUrl(image.url)}
                  className="flex-1"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copier URL
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(image.id, image.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune image téléchargée</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

