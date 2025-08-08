
// Helper function to ensure image URLs are correct
export const getValidImageUrl = (url: string | null) => {
  if (!url) return null;
  
  // If the URL starts with 'blob:', it's a temporary URL that won't persist
  if (url.startsWith('blob:')) {
    console.error("Blob URL detected in image:", url);
    return "/placeholder.svg";
  }
  
  return url;
};

