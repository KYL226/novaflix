// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, User, LogOut, Home, Film, Tv, BookOpen, Menu, Crown } from 'lucide-react';
import SearchResults from './SearchResults';
import ThemeToggle from './ThemeToggle';
import SubscriptionStatus from './SubscriptionStatus';

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowSearchResults(false);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-600">
          Novaflix
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6 ml-8">
          <Link href="/" className="hover:text-red-500 transition flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
          <Link href="/films" className="hover:text-red-500 transition flex items-center space-x-1">
            <Film className="h-4 w-4" />
            <span>Films</span>
          </Link>
          <Link href="/series" className="hover:text-red-500 transition flex items-center space-x-1">
            <Tv className="h-4 w-4" />
            <span>Séries</span>
          </Link>
          <Link href="/documentaires" className="hover:text-red-500 transition flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>Docu</span>
          </Link>
        </nav>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un film, série..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="bg-white/20 border-none text-white placeholder-gray-300 pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Résultats en direct */}
          {showSearchResults && (
            <div className="absolute left-0 right-0 mt-1 bg-black border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <SearchResults query={searchQuery} onSelect={() => setShowSearchResults(false)} />
            </div>
          )}
        </form>

        {/* Actions Utilisateur */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isLoading ? (
            <div className="text-gray-400 text-sm">Chargement...</div>
          ) : user ? (
            <>
              <SubscriptionStatus />
              
              {/* Indicateur de rôle */}
              {user.role === 'admin' && (
                <Badge variant="secondary" className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              
              {/* Indicateur d'abonnement */}
              {user.subscription === 'premium' && (
                <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <Link href="/profile" className="hover:text-red-500 transition">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || '/avatar-placeholder.svg'} alt="Profil" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/auth">Connexion</Link>
            </Button>
          )}
        </div>

        {/* Menu Mobile */}
        <button className="md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}