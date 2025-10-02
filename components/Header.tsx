'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  LogOut,
  Crown,
  Menu,
} from 'lucide-react';
import SearchResults from './SearchResults';
import ThemeToggle from './ThemeToggle';
import SimpleSubscriptionStatus from './SimpleSubscriptionStatus';

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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

  const isHomePage = pathname === '/';
  const isGuest = !user && !isLoading;
  const useTransparentHeader = isHomePage && isGuest;

  return (
    <header
      className={`${
        useTransparentHeader
          ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent'
          : 'bg-black'
      } text-white z-50 ${useTransparentHeader ? '' : 'sticky top-0 shadow-lg'}`}
    >
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo Netflix-like */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-widest text-red-600"
        >
          NOVAFLIX
        </Link>

        {/* Navigation principale Netflix-style */}
        {user && (
          <nav className="hidden md:flex items-center space-x-6 ml-8 text-sm font-medium">
            <a href="#" className="hover:text-red-500 transition">Accueil</a>
            <a href="#" className="hover:text-red-500 transition">Séries</a>
            <a href="#" className="hover:text-red-500 transition">Films</a>
            <a href="#" className="hover:text-red-500 transition">Nouveautés</a>
            <a href="#" className="hover:text-red-500 transition">Ma Liste</a>
          </nav>
        )}

        {/* Barre de recherche */}
        {user && !useTransparentHeader && (
          <form
            onSubmit={handleSearch}
            className="hidden lg:block flex-1 max-w-sm mx-6"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="bg-white/10 text-white border border-gray-600 rounded-full pl-10 placeholder:text-gray-300"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {showSearchResults && (
              <div className="absolute left-0 right-0 mt-1 bg-black border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <SearchResults
                  query={searchQuery}
                  onSelect={() => setShowSearchResults(false)}
                />
              </div>
            )}
          </form>
        )}

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {!useTransparentHeader && <ThemeToggle />}

          {isLoading ? (
            <span className="text-gray-400 text-sm">Chargement...</span>
          ) : user ? (
            <>
              <SimpleSubscriptionStatus />
              {user.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Badge className="bg-purple-600 hover:bg-purple-700 flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                </Link>
              )}
              <Link href="/profile" className="hover:text-red-500">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || '/avatar-placeholder.svg'}
                    alt="Profil"
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-1"
            >
              <Link href="/auth">Connexion</Link>
            </Button>
          )}
        </div>

        {/* Menu Mobile */}
        {!useTransparentHeader && (
          <button className="md:hidden text-white hover:text-red-500">
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>
    </header>
  );
}
