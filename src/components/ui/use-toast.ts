"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export interface ToastActionElement {
  altText?: string;
  action?: React.ReactNode;
}

// Hook simplifié qui utilise directement sonner
const useToast = () => {
  const toast = React.useCallback(({ title, description, variant = "default" }: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    if (variant === "destructive") {
      sonnerToast.error(title || "Erreur", {
        description: description,
      });
    } else {
      sonnerToast.success(title || "Succès", {
        description: description,
      });
    }
  }, []);

  return {
    toast,
    dismiss: () => {}, // Pas nécessaire avec sonner
  };
};

// Fonction toast standalone pour compatibilité
const toast = ({ title, description, variant = "default" }: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  if (variant === "destructive") {
    sonnerToast.error(title || "Erreur", {
      description: description,
    });
  } else {
    sonnerToast.success(title || "Succès", {
      description: description,
    });
  }
};

export { useToast, toast };
