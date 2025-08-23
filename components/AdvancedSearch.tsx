'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  query: string;
  genre: string;
  type: string;
  year: string;
  duration: string;
}

export default function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: '',
    type: '',
    year: '',
    duration: ''
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genre: '',
      type: '',
      year: '',
      duration: ''
    });
    onSearch({
      query: '',
      genre: '',
      type: '',
      year: '',
      duration: ''
    });
  };

  const genres = [
    'Action', 'Aventure', 'Comédie', 'Drame', 'Horreur', 
    'Science-fiction', 'Thriller', 'Romance', 'Documentaire'
  ];

  const types = ['film', 'serie', 'documentaire'];
  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());
  const durations = ['< 90 min', '90-120 min', '120-150 min', '> 150 min'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche principale */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un film, série, acteur..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
        </Button>
        
        <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
          Rechercher
        </Button>
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <div className="bg-gray-900 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filtres avancés</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select value={filters.genre} onValueChange={(value) => setFilters({ ...filters, genre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Année</Label>
              <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les années</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Durée</Label>
              <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les durées" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les durées</SelectItem>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
