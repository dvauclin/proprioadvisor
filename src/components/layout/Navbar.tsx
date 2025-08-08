"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui-kit/button";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui-kit/badge";
import UserMenu from "@/components/auth/UserMenu";
import { useFavorites } from "@/contexts/FavoritesContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header role="banner" className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav role="navigation" aria-label="Navigation principale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2 rounded-md">
              <div className="w-8 h-8 bg-brand-chartreuse rounded-full mr-2" aria-hidden="true"></div>
              <span className="text-lg font-semibold">PROPRIOADVISOR</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4" role="menubar">
              <Link
                href="/gestion-airbnb"
                role="menuitem"
                aria-current={isActive("/gestion-airbnb") ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2 ${
                  isActive("/gestion-airbnb")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors`}
              >
                Guide Airbnb
              </Link>
              <Link
                href="/simulateur-airbnb"
                role="menuitem"
                aria-current={isActive("/simulateur-airbnb") ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2 ${
                  isActive("/simulateur-airbnb")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors`}
              >
                Simulateur Airbnb
              </Link>
              <Link
                href="/favoris"
                role="menuitem"
                aria-current={isActive("/favoris") ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2 ${
                  isActive("/favoris")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors flex items-center gap-1`}
              >
                Favoris
                {favoritesCount > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-red-500 text-white text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </nav>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="focus:outline-none focus:ring-2 focus:ring-brand-chartreuse focus:ring-offset-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden"
            role="navigation"
            aria-label="Menu de navigation mobile"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/gestion-airbnb"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/gestion-airbnb")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Guide Airbnb
              </Link>
              <Link
                href="/simulateur-airbnb"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/simulateur-airbnb")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Simulateur Airbnb
              </Link>
              <Link
                href="/favoris"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/favoris")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                } transition-colors flex items-center justify-between`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Favoris</span>
                {favoritesCount > 0 && (
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

