'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        // Redirection basée sur le rôle de l'utilisateur
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        await register(name, email, password);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/10 backdrop-blur-md text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">CinéLux</CardTitle>
          <CardDescription className="text-gray-300">
            {isLogin ? 'Connecte-toi pour accéder à tes films' : 'Rejoins CinéLux aujourd\'hui'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/20">
              <TabsTrigger value="login" className="data-[state=active]:bg-white/30">
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Inscription
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <Label htmlFor="name" className="text-gray-200">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 bg-white/20 border-white/30 text-white placeholder-gray-400"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="mb-4">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-white/20 border-white/30 text-white placeholder-gray-400"
                  placeholder="vous@email.com"
                  required
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="password" className="text-gray-200">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-white/20 border-white/30 text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer un compte'
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}