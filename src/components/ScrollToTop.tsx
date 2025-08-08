"use client";

import { useScrollToTop } from '@/hooks/useScrollToTop';

const ScrollToTop = () => {
  useScrollToTop();
  
  // Ce composant ne rend rien, il utilise juste le hook
  return null;
};

export default ScrollToTop;

