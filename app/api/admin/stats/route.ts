// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Vérifier que l'utilisateur est admin
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('novaflix');

    // Récupérer les statistiques
    const [
      totalUsers,
      totalMovies,
      totalSeries,
      totalDocumentaries,
      activeSubscriptions,
      totalViews,
      totalFavorites
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('movies').countDocuments({ type: 'film' }),
      db.collection('movies').countDocuments({ type: 'serie' }),
      db.collection('movies').countDocuments({ type: 'documentaire' }),
      db.collection('subscriptions').countDocuments({ status: 'active' }),
      db.collection('views').countDocuments(), // Si vous avez une collection views
      db.collection('users').aggregate([
        { $unwind: '$favorites' },
        { $count: 'total' }
      ]).toArray().then(result => result[0]?.total || 0)
    ]);

    // Calculer la note moyenne (exemple avec une collection ratings)
    const ratingsResult = await db.collection('ratings').aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]).toArray();
    
    const averageRating = ratingsResult[0]?.averageRating || 0;

    const stats = {
      totalUsers,
      totalMovies,
      totalSeries,
      totalDocumentaries,
      activeSubscriptions,
      totalViews,
      totalFavorites,
      averageRating: Math.round(averageRating * 10) / 10 // Arrondir à 1 décimale
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques'
    }, { status: 500 });
  }
}