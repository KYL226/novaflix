'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Tv, BookOpen, Star } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

const categories = [
  { id: 'film', label: 'Films', icon: Film, color: 'bg-blue-600' },
  { id: 'serie', label: 'Séries', icon: Tv, color: 'bg-purple-600' },
  { id: 'documentaire', label: 'Documentaires', icon: BookOpen, color: 'bg-green-600' },
  { id: 'favoris', label: 'Favoris', icon: Star, color: 'bg-yellow-600' }
];

export default function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  className = '' 
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="bg-red-600 hover:bg-red-700"
      >
        Tous
      </Button>
      
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={selectedCategory === category.id ? category.color : ''}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
