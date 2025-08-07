"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import StructuredData from "@/components/seo/StructuredData";
import { createArticleStructuredData, createBreadcrumbStructuredData } from "@/utils/structuredDataHelpers";
import { useBlogPostData } from "@/hooks/useBlogPostData";
import { getValidImageUrl } from "@/utils/articleUtils";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleContent from "@/components/blog/ArticleContent";
import ShareSection from "@/components/blog/ShareSection";
import RecentArticlesSection from "@/components/blog/RecentArticlesSection";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TableOfContents, { Heading } from "@/components/blog/TableOfContents";
import FaqSection from "@/components/blog/FaqSection";

interface BlogPostProps {
  slug: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug }) => {
  const {
    article,
    recentArticles,
    loading
  } = useBlogPostData(slug);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [processedContent, setProcessedContent] = useState('');
  
  const slugify = (text: string): string => {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
  };
  
  useEffect(() => {
    if (article?.contenu) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.contenu, 'text/html');
      const foundHeadings: Heading[] = [];
      
      // Traiter tous les headings (h2, h3, h4)
      doc.querySelectorAll('h2, h3, h4').forEach(heading => {
        const text = heading.textContent || '';
        const id = slugify(text);
        heading.setAttribute('id', id);
        foundHeadings.push({
          id,
          text,
          level: parseInt(heading.tagName.substring(1), 10)
        });
      });
      
      setHeadings(foundHeadings);
      setProcessedContent(doc.body.innerHTML);
    }
  }, [article?.contenu]);

  // Gérer le scroll vers l'ancre au chargement de la page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      
      if (element) {
        // Attendre que le contenu soit chargé
        setTimeout(() => {
          const header = document.querySelector('header');
          const headerHeight = header ? header.getBoundingClientRect().height : 64;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [processedContent]);
  
  if (loading) {
    return <div className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-chartreuse" />
      </div>;
  }
  
  if (!article) {
    return null;
  }
  
  const extendedArticle = article as any;
  const articleImage = article.image ? getValidImageUrl(article.image) || undefined : undefined;

  const breadcrumbItems = [{
    label: "Accueil",
    href: "/"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: article.titre
  }];
  const breadcrumbStructuredData = createBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.label, url: item.href }))
  );

  // Create FAQ structured data that matches prerender implementation
  const createFaqStructuredData = () => {
    const faqs = [{
      q: extendedArticle.question_1,
      a: extendedArticle.reponse_1
    }, {
      q: extendedArticle.question_2,
      a: extendedArticle.reponse_2
    }, {
      q: extendedArticle.question_3,
      a: extendedArticle.reponse_3
    }, {
      q: extendedArticle.question_4,
      a: extendedArticle.reponse_4
    }, {
      q: extendedArticle.question_5,
      a: extendedArticle.reponse_5
    }].filter(faq => faq.q && faq.a);
    
    if (faqs.length === 0) {
      return null;
    }
    
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    };
  };

  const faqStructuredData = createFaqStructuredData();
  const articleStructuredData = createArticleStructuredData(article, articleImage);

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbStructuredData, articleStructuredData, faqStructuredData].filter(Boolean)} />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-3">
            <ArticleHeader article={article} />
            <ArticleContent article={article} relatedArticles={recentArticles} processedContent={processedContent} />
            <ShareSection />
            <FaqSection article={extendedArticle} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
        
        <RecentArticlesSection articles={recentArticles} />
      </div>
    </div>
  );
};

export default BlogPost;

