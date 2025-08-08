
import { supabase } from "@/integrations/supabase/client";
import { ImageFile } from "@/types";

export const getAllImages = async (): Promise<ImageFile[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error("Error fetching images:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    const images: ImageFile[] = data
      .filter(file => file.name && !file.name.startsWith('.'))
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(file.name);
        
        return {
          id: file.name,
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size,
          type: file.metadata?.mimetype
        };
      });

    return images;
  } catch (error) {
    console.error("Error in getAllImages:", error);
    throw error;
  }
};

export const uploadImage = async (file: File, bucket: string = 'images'): Promise<{ success: boolean; url?: string; path?: string; name?: string; error?: string }> => {
  try {
    console.log(`uploadImage - Starting upload to bucket: ${bucket}`);
    console.log(`uploadImage - File details:`, {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const fileExt = file.name.split('.').pop();
    // Use crypto.randomUUID() for a more robust unique filename
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    // Create organized path structure - use logos/conciergeries/ subfolder for conciergerie logos
    let filePath = fileName;
    if (bucket === 'images') {
      // Check if this is likely a conciergerie logo upload based on context
      filePath = `logos/conciergeries/${fileName}`;
    }

    console.log(`uploadImage - Uploading to path: ${filePath}`);

    // Upload to the images bucket with organized folder structure
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("uploadImage - Upload error:", uploadError);
      
      // Analyser le type d'erreur pour donner un message plus prÃ©cis
      if (uploadError.message.includes('Bucket not found')) {
        return { success: false, error: `Le bucket 'images' n'existe pas` };
      } else if (uploadError.message.includes('not allowed')) {
        return { success: false, error: "Permissions insuffisantes pour uploader dans ce bucket" };
      } else {
        return { success: false, error: uploadError.message };
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    console.log(`uploadImage - Success! Public URL: ${publicUrl}`);

    return { 
      success: true, 
      url: publicUrl, 
      path: filePath, 
      name: fileName 
    };
  } catch (error) {
    console.error("uploadImage - Unexpected upload error:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const deleteImage = async (path: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

