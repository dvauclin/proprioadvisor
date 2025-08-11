"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Label } from '@/components/ui-kit/label';
import { Alert, AlertDescription } from '@/components/ui-kit/alert';
import { Loader2, ArrowLeft } from 'lucide-react';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  
  const { signIn, resetPassword, loading } = useAuth();

  // Suppression du useEffect qui redirige automatiquement pour éviter les boucles

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(error.message);
        }
      } else {
        // Connexion réussie - pas de redirection automatique pour éviter les boucles
        setSuccess('Connexion réussie !');
      }
    } catch (error: any) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email) {
      setError('Veuillez saisir votre adresse email');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError("Erreur lors de l'envoi de l'email de réinitialisation");
      } else {
        setSuccess('Un email de réinitialisation a été envoyé à votre adresse email');
        setShowResetForm(false);
      }
    } catch (error: any) {
      setError('Une erreur est survenue lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-brand-chartreuse rounded-full mr-2"></div>
            <span className="text-lg font-semibold">PROPRIOADVISOR</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {showResetForm ? 'Réinitialiser le mot de passe' : 'Connexion'}
          </h2>
          <p className="mt-2 text-gray-600">
            {showResetForm 
              ? 'Saisissez votre email pour recevoir un lien de réinitialisation'
              : 'Connectez-vous à votre compte pour gérer votre conciergerie'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {showResetForm ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetForm(false)}
                    className="p-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  Mot de passe oublié
                </div>
              ) : (
                'Se connecter'
              )}
            </CardTitle>
            <CardDescription>
              {showResetForm 
                ? 'Nous vous enverrons un email pour réinitialiser votre mot de passe'
                : 'Entrez vos identifiants pour accéder à votre espace'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showResetForm ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </form>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {!showResetForm && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link href="/inscription" className="text-primary hover:underline">
                    Créer une conciergerie
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Connexion;




