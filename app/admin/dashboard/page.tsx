// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Video, CreditCard, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading } = useProtectedRoute(true); // true = requireAdmin
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;

    // Dans app/admin/dashboard/page.tsx → modifie `fetchStats`
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Impossible de charger les statistiques.");
      }
    };

    fetchStats();
  }, [user, isLoading]);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Tableau de Bord Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Utilisateurs
            </CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users || "..."}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Utilisateurs Actifs (7j)
            </CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Films
            </CardTitle>
            <Video className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.moviesByType?.film || 0}
            </div>
            <p className="text-sm text-gray-500">
              Séries: {stats?.moviesByType?.serie || 0}
            </p>
            <p className="text-sm text-gray-500">
              Docs: {stats?.moviesByType?.documentaire || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Abonnements
            </CardTitle>
            <CreditCard className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.subscriptions || "..."}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Button
          onClick={() => router.push("/admin/movies/add")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Ajouter un Film
        </Button>
        <Button onClick={() => router.push("/admin/users")} variant="outline">
          Gérer les Utilisateurs
        </Button>
      </div>
    </div>
  );
}
