// lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Fonction utilisée par ShadCN pour fusionner les classes CSS
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// ✅ Format une date au format français
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ✅ Coupe le texte trop long et ajoute "..."
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.slice(0, length) + '...' : text;
};
