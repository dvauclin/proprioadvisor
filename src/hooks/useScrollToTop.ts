"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll vers le haut à chaque changement de route
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};
