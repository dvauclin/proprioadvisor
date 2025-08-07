
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { uploadImage } from "@/services/storageService";

export const useLogoUpload = () => {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Effect to clean up blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Logo upload started for file:", file.name, "size:", file.size);
    setLogoFile(file);
    setUploadError(null);
    
    // Create a temporary URL for preview and store it for cleanup
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    setLogoPreview(previewUrl);
    
    // Start uploading to Supabase Storage (images bucket)
    setIsUploadingLogo(true);
    setLogoUrl(null); // Reset permanent URL while uploading a new one
    
    try {
      console.log("Uploading logo to Supabase Storage (images bucket with logos/conciergeries/ subfolder)...");
      const result = await uploadImage(file, 'images');
      
      console.log("Upload result:", result);
      
      if (result.success && result.url) {
        console.log("Logo uploaded successfully with URL:", result.url);
        setLogoUrl(result.url);
        setLogoPreview(result.url); // Switch preview to the permanent URL
        setUploadError(null);
        
        toast({
          title: "Logo téléchargé",
          description: "Le logo a été téléchargé avec succès."
        });
      } else {
        const errorMsg = result.error || "Erreur inconnue lors de l'upload";
        console.error("Failed to upload logo:", errorMsg);
        setUploadError(errorMsg);
        // Keep the local preview on error
        setLogoUrl(null);
        
        toast({
          title: "Erreur de téléchargement",
          description: `Impossible de télécharger le logo: ${errorMsg}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Logo upload error:", error);
      setUploadError(errorMsg);
      setLogoUrl(null);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant le téléchargement du logo.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return {
    logoFile,
    logoPreview,
    isUploadingLogo,
    logoUrl,
    uploadError,
    handleLogoChange,
    setLogoPreview // Expose the setter
  };
};
