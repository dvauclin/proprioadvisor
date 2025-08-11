"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Badge } from '@/components/ui-kit/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Article } from '@/types';

interface RecentArticleCardProps {
  article: Article;
}

const RecentArticleCard: React.FC<RecentArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/${article.slug}`} className="block group">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              Article
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDate(article.datePublication || article.date_modification || article.createdAt || '')}
            </span>
          </div>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {article.titre}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-3 mb-4">
            {article.excerpt || 'Aucune description disponible'}
          </CardDescription>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                David Vauclin
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(article.datePublication || article.date_modification || article.createdAt || '')}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecentArticleCard;




