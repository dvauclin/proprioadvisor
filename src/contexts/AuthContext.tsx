"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      const typedProfile: Profile = {
        ...data,
        role: data.role as 'admin' | 'user',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };

      return typedProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Timeout pour Ã©viter un chargement infini
    const loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Auth loading timeout - forcing loading to false');
        setLoading(false);
        setInitialized(true);
      }
    }, 3000); // 3 secondes maximum

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        const handleAuthChange = async () => {
          console.log('Auth state changed:', event);
          const currentUser = session?.user ?? null;
          setSession(session);
          setUser(currentUser);

          if (currentUser) {
            const profileData = await fetchProfile(currentUser.id);
            if (mounted) {
              setProfile(profileData);
              setLoading(false);
            }
          } else {
            setProfile(null);
            setLoading(false);
          }
          
          if (mounted && !initialized) {
            setInitialized(true);
          }
        };

        handleAuthChange();
      }
    );

    // Initial check - optimisÃ© pour rÃ©duire le temps de chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (!session) {
        setLoading(false);
        setInitialized(true);
      } else {
        // Si il y a une session, on la traite immÃ©diatement
        setSession(session);
        setUser(session.user);
        
        // On rÃ©cupÃ¨re le profil en arriÃ¨re-plan
        fetchProfile(session.user.id).then((profileData) => {
          if (mounted) {
            setProfile(profileData);
            setLoading(false);
            setInitialized(true);
          }
        });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Sign in successful');
      // onAuthStateChange will handle setting loading to false after fetching the profile
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      console.log('Sign up successful');
      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out.');
      await supabase.auth.signOut();
      // State will be cleared by onAuthStateChange
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }
      
      console.log('Reset password email sent');
      return { error: null };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Update password error:', error);
        return { error };
      }
      
      console.log('Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update password exception:', error);
      return { error };
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

