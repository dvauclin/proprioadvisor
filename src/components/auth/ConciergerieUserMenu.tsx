"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { Button } from '@/components/ui-kit/button';
import { Avatar, AvatarFallback } from '@/components/ui-kit/avatar';
import { User, LogOut, Settings, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const ConciergerieUserMenu = () => {
  const { profile, signOut } = useAuth();
  const router = useRouter();




  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };







  const userInitials = profile?.email
    ? profile.email.split('@')[0].substring(0, 2).toUpperCase()
    : 'U';

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
            <p className="font-medium">{profile?.email}</p>
            <p className="text-xs text-muted-foreground">
              Gestionnaire de conciergerie
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/ma-conciergerie" className="cursor-pointer">
            <Building className="mr-2 h-4 w-4" />
            <span>Ma conciergerie</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/subscription" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Modifier ma souscription</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/mes-leads" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mes leads</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConciergerieUserMenu;




