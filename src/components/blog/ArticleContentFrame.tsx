import React from 'react';
import { cn } from '@/lib/utils';

interface ArticleContentFrameProps {
  children: React.ReactNode;
  className?: string;
}

const ArticleContentFrame: React.FC<ArticleContentFrameProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm",
      "p-6 md:p-8 lg:p-10",
      "w-full",
      "hover:shadow-md transition-shadow duration-200",
      "relative z-10",
      className
    )}>
      {children}
    </div>
  );
};

export default ArticleContentFrame;
