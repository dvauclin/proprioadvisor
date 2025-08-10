"use client";

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RealtimeStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  useEffect(() => {
    // Vérifier la connexion initiale
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('articles')
          .select('id')
          .limit(1);
        
        setIsConnected(!error);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();

    // Configurer une subscription de test pour vérifier le temps réel
    const subscription = supabase
      .channel('realtime-test')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        setIsRealtimeActive(true);
        // Désactiver l'indicateur après 2 secondes
        setTimeout(() => setIsRealtimeActive(false), 2000);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        {isConnected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
        <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
          {isConnected ? 'Connecté' : 'Déconnecté'}
        </span>
      </div>
      
      <div className="w-px h-4 bg-gray-300" />
      
      <div className="flex items-center gap-1">
        {isRealtimeActive ? (
          <Wifi className="h-4 w-4 text-blue-600 animate-pulse" />
        ) : (
          <WifiOff className="h-4 w-4 text-gray-400" />
        )}
        <span className={isRealtimeActive ? 'text-blue-700' : 'text-gray-600'}>
          Temps réel
        </span>
      </div>
    </div>
  );
};

export default RealtimeStatusIndicator;
