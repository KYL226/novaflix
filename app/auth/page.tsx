'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(prefillEmail);
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
        const user = await login(email, password);
        // Redirection basée sur le rôle de l'utilisateur
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        await register(name, email, password);
        // L'utilisateur est maintenant connecté automatiquement
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-[url('/back_netflix.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />

      <header className="relative z-10 px-6 py-6">
        {/* <Link href="/" className="text-3xl font-extrabold text-red-600">Novaflix</Link> */}

      </header>

      <div className="relative z-10 flex items-center justify-center px-4 pb-16">
        <Card className="w-full max-w-lg border border-gray-800 bg-black/70 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">{isLogin ? 'Se connecter' : 'Créer un compte'}</CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin ? 'Accédez à votre compte pour continuer à regarder' : "Rejoignez Netflix Clone et commencez à regarder"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent border border-gray-700">
                <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
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
                      className="mt-1 bg-[#111] border-gray-700 text-white placeholder-gray-500"
                      placeholder="John Doe"
                      autoComplete="name"
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
                    className="mt-1 bg-[#111] border-gray-700 text-white placeholder-gray-500"
                    placeholder="vous@email.com"
                    autoComplete="email"
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
                    className="mt-1 bg-[#111] border-gray-700 text-white placeholder-gray-500"
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
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
    </div>
  );
}