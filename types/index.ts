// types/index.ts

export type User = {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  subscription?: 'basic' | 'premium' | 'free';
  avatar?: string;
  banned?: boolean; // Nouveau champ pour gérer le statut actif/inactif
  createdAt?: Date;
  updatedAt?: Date;
};

export type Movie = {
  _id?: string;
  title: string;
  description: string;
  genre: string[];
  duration: number; // en minutes
  releaseYear: number;
  videoUrl: string; // chemin relatif dans secure-media/videos/
  posterUrl: string; // chemin relatif dans secure-media/images/
  type: 'film' | 'serie' | 'documentaire';
  published?: boolean; // Nouveau champ pour gérer la publication
  createdAt?: Date;
  updatedAt?: Date;
};

export type Subscription = {
  userId: string;
  type: 'basic' | 'premium';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod: 'mobile_money' | 'credit_card' | 'paypal';
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};