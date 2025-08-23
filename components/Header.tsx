// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, LogOut, Home, Film, Tv, BookOpen, Menu } from 'lucide-react';
import SearchResults from './SearchResults';
import ThemeToggle from './ThemeToggle';
import SubscriptionStatus from './SubscriptionStatus';

export default function Header() {
  const { user, logout } = useAuth();
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

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-600">
          Novaflix
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6 ml-8">
          <Link href="/" className="hover:text-red-500 transition">Accueil</Link>
          <Link href="/films" className="hover:text-red-500 transition">Films</Link>
          <Link href="/series" className="hover:text-red-500 transition">Séries</Link>
          <Link href="/documentaires" className="hover:text-red-500 transition">Docu</Link>
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

          {user ? (
            <>
              <SubscriptionStatus />
              <Link href="/profile" className="hover:text-red-500">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || '/avatar-placeholder.jpg'} alt="Profil" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
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

      {/* Navigation Mobile */}
      <div className="md:hidden bg-gray-900 px-4 py-2 space-x-4 text-sm">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-red-500"><Home className="w-4 h-4" /> Accueil</Link>
        <Link href="/films" className="inline-flex items-center gap-1 hover:text-red-500"><Film className="w-4 h-4" /> Films</Link>
        <Link href="/series" className="inline-flex items-center gap-1 hover:text-red-500"><Tv className="w-4 h-4" /> Séries</Link>
        <Link href="/documentaires" className="inline-flex items-center gap-1 hover:text-red-500"><BookOpen className="w-4 h-4" /> Docu</Link>
      </div>
    </header>
  );
}