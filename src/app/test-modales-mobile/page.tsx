"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui-kit/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-kit/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-kit/card';

export default function TestModalesMobile() {
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});

  const toggleModal = (modalName: string) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  };

  const modals = [
    {
      name: 'modal-simple',
      title: 'Modal Simple',
      content: 'Cette modal contient peu de contenu et devrait s\'afficher correctement sur mobile.'
    },
    {
      name: 'modal-long-content',
      title: 'Modal avec Contenu Long',
      content: (
        <div className="space-y-4">
          <p>Cette modal contient beaucoup de contenu pour tester le scroll sur mobile.</p>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="p-4 border rounded bg-gray-50">
              <h3 className="font-semibold">Section {i + 1}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          ))}
          <p>Fin du contenu long. Cette modal devrait être entièrement visible et scrollable sur mobile.</p>
        </div>
      )
    },
    {
      name: 'modal-form',
      title: 'Modal avec Formulaire',
      content: (
        <div className="space-y-4">
          <p>Cette modal contient un formulaire pour tester l\'affichage sur mobile.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full p-2 border rounded" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea className="w-full p-2 border rounded" rows={4} placeholder="Votre message..."></textarea>
            </div>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="p-3 border rounded bg-gray-50">
                <p>Champ supplémentaire {i + 1} pour tester le scroll</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Test des Modales sur Mobile</h1>
        <p className="text-gray-600">
          Testez l'affichage des modales sur mobile. Toutes les modales doivent être entièrement visibles de haut en bas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modals.map((modal) => (
          <Card key={modal.name}>
            <CardHeader>
              <CardTitle>{modal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => toggleModal(modal.name)}
                className="w-full"
              >
                Ouvrir {modal.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modales */}
      {modals.map((modal) => (
        <Dialog 
          key={modal.name}
          open={openModals[modal.name]} 
          onOpenChange={() => toggleModal(modal.name)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modal.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {modal.content}
            </div>
          </DialogContent>
        </Dialog>
      ))}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-800 mb-2">Instructions de test :</h2>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Ouvrez cette page sur un appareil mobile ou utilisez les outils de développement</li>
          <li>• Testez chaque modal en cliquant sur les boutons</li>
          <li>• Vérifiez que toutes les modales sont entièrement visibles de haut en bas</li>
          <li>• Vérifiez que le scroll fonctionne correctement dans les modales avec du contenu long</li>
          <li>• Vérifiez que les modales ne sont pas coupées en bas de l'écran</li>
        </ul>
      </div>
    </div>
  );
}
