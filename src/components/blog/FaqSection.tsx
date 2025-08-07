
import React from 'react';
import { Article } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqSectionProps {
  article: Article;
}

const FaqSection: React.FC<FaqSectionProps> = ({ article }) => {
  const extendedArticle = article as any;
  
  const faqs = [
    { q: extendedArticle.question_1, a: extendedArticle.reponse_1 },
    { q: extendedArticle.question_2, a: extendedArticle.reponse_2 },
    { q: extendedArticle.question_3, a: extendedArticle.reponse_3 },
    { q: extendedArticle.question_4, a: extendedArticle.reponse_4 },
    { q: extendedArticle.question_5, a: extendedArticle.reponse_5 },
  ].filter(faq => faq.q && faq.a);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqSection;
