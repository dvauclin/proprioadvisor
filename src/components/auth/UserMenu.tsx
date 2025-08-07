
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Shield, PlusCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import ConciergerieUserMenu from './ConciergerieUserMenu';
import { Skeleton } from '@/components/ui/skeleton';

const UserMenu = () => {
  const { user, profile, signOut, isAdmin, loading } = useAuth();

  // Skeleton loader pour un chargement plus élégant
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/connexion">
          <Button variant="ghost" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Connexion</span>
          </Button>
        </Link>
        <Link href="/inscription">
          <Button variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ajouter une conciergerie</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Si c'est un admin, utiliser le menu admin classique
  if (isAdmin) {
    const userInitials = profile.email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{profile.email}</p>
              <p className="text-xs text-muted-foreground">
                Administrateur
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/connexion" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Connexion admin</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sinon, utiliser le menu pour les gestionnaires de conciergerie
  return <ConciergerieUserMenu />;
};

export default UserMenu;



