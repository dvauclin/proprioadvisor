import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types";

// NOTE: We use `as any` because the global `Article` type in `src/types` is read-only
// and cannot be updated with the new fields. The data is correctly fetched from DB.

export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
      .order('date_modification', { ascending: false });
    
    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
    
    return data.map(article => ({
      id: article.id,
      titre: article.titre,
      slug: article.slug,
      excerpt: article.excerpt,
      contenu: article.contenu,
      image: article.image,
      datePublication: article.date_modification,
      createdAt: article.created_at,
      resume: article.resume,
      question_1: article.question_1,
      reponse_1: article.reponse_1,
      question_2: article.question_2,
      reponse_2: article.reponse_2,
      question_3: article.question_3,
      reponse_3: article.reponse_3,
      question_4: article.question_4,
      reponse_4: article.reponse_4,
      question_5: article.question_5,
      reponse_5: article.reponse_5
    })) as any;
  } catch (error) {
    console.error("Unexpected error fetching articles:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching article by slug:", error);
      return null;
    }

    return {
      id: data.id,
      titre: data.titre,
      slug: data.slug,
      excerpt: data.excerpt,
      contenu: data.contenu,
      image: data.image,
      datePublication: data.date_modification,
      createdAt: data.created_at,
      resume: data.resume,
      question_1: data.question_1,
      reponse_1: data.reponse_1,
      question_2: data.question_2,
      reponse_2: data.reponse_2,
      question_3: data.question_3,
      reponse_3: data.reponse_3,
      question_4: data.question_4,
      reponse_4: data.reponse_4,
      question_5: data.question_5,
      reponse_5: data.reponse_5
    } as any;
  } catch (error) {
    console.error("Unexpected error fetching article by slug:", error);
    return null;
  }
};

export const getRecentArticles = async (limit: number = 5): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
      .order('date_modification', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent articles:", error);
      return [];
    }

    return data.map(article => ({
      id: article.id,
      titre: article.titre,
      slug: article.slug,
      excerpt: article.excerpt,
      contenu: article.contenu,
      image: article.image,
      datePublication: article.date_modification,
      createdAt: article.created_at,
      resume: article.resume,
      question_1: article.question_1,
      reponse_1: article.reponse_1,
      question_2: article.question_2,
      reponse_2: article.reponse_2,
      question_3: article.question_3,
      reponse_3: article.reponse_3,
      question_4: article.question_4,
      reponse_4: article.reponse_4,
      question_5: article.question_5,
      reponse_5: article.reponse_5
    })) as any;
  } catch (error) {
    console.error("Unexpected error fetching recent articles:", error);
    return [];
  }
};

export const addArticle = async (article: Omit<Article, 'id'>): Promise<{ success: boolean; article?: Article; error?: string }> => {
  try {
    const extendedArticle = article as any;
    const { data, error } = await supabase
      .from('articles')
      .insert({
        titre: extendedArticle.titre,
        slug: extendedArticle.slug,
        excerpt: extendedArticle.excerpt,
        contenu: extendedArticle.contenu,
        image: extendedArticle.image,
        date_modification: extendedArticle.datePublication,
        resume: extendedArticle.resume,
        question_1: extendedArticle.question_1,
        reponse_1: extendedArticle.reponse_1,
        question_2: extendedArticle.question_2,
        reponse_2: extendedArticle.reponse_2,
        question_3: extendedArticle.question_3,
        reponse_3: extendedArticle.reponse_3,
        question_4: extendedArticle.question_4,
        reponse_4: extendedArticle.reponse_4,
        question_5: extendedArticle.question_5,
        reponse_5: extendedArticle.reponse_5,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding article:", error);
      return { success: false, error: error.message };
    }
    
    const newArticle: Article = {
      id: data.id,
      titre: data.titre,
      slug: data.slug,
      excerpt: data.excerpt,
      contenu: data.contenu,
      image: data.image,
      datePublication: data.date_modification,
      createdAt: data.created_at,
      resume: data.resume,
      question_1: data.question_1,
      reponse_1: data.reponse_1,
      question_2: data.question_2,
      reponse_2: data.reponse_2,
      question_3: data.question_3,
      reponse_3: data.reponse_3,
      question_4: data.question_4,
      reponse_4: data.reponse_4,
      question_5: data.question_5,
      reponse_5: data.reponse_5
    } as any;
    
    return { success: true, article: newArticle };
  } catch (error) {
    console.error("Unexpected error adding article:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const updateArticle = async (article: Article): Promise<{ success: boolean; article?: Article; error?: string }> => {
  try {
    const extendedArticle = article as any;
    const { data, error } = await supabase
      .from('articles')
      .update({
        titre: extendedArticle.titre,
        slug: extendedArticle.slug,
        excerpt: extendedArticle.excerpt,
        contenu: extendedArticle.contenu,
        image: extendedArticle.image,
        date_modification: extendedArticle.datePublication,
        resume: extendedArticle.resume,
        question_1: extendedArticle.question_1,
        reponse_1: extendedArticle.reponse_1,
        question_2: extendedArticle.question_2,
        reponse_2: extendedArticle.reponse_2,
        question_3: extendedArticle.question_3,
        reponse_3: extendedArticle.reponse_3,
        question_4: extendedArticle.question_4,
        reponse_4: extendedArticle.reponse_4,
        question_5: extendedArticle.question_5,
        reponse_5: extendedArticle.reponse_5,
      })
      .eq('id', extendedArticle.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating article:", error);
      return { success: false, error: error.message };
    }
    
    const updatedArticle: Article = {
      id: data.id,
      titre: data.titre,
      slug: data.slug,
      excerpt: data.excerpt,
      contenu: data.contenu,
      image: data.image,
      datePublication: data.date_modification,
      createdAt: data.created_at,
      resume: data.resume,
      question_1: data.question_1,
      reponse_1: data.reponse_1,
      question_2: data.question_2,
      reponse_2: data.reponse_2,
      question_3: data.question_3,
      reponse_3: data.reponse_3,
      question_4: data.question_4,
      reponse_4: data.reponse_4,
      question_5: data.question_5,
      reponse_5: data.reponse_5
    } as any;
    
    return { success: true, article: updatedArticle };
  } catch (error) {
    console.error("Unexpected error updating article:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const deleteArticle = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting article:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting article:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};
