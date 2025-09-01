import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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

    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json({ error: 'ID du film requis' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('novaflix');
    
    // Vérifier si le film est déjà dans les favoris
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.id) as any,
      'favorites': new ObjectId(movieId) as any
    });

    if (user) {
      // Retirer des favoris
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.id) as any },
        { $pull: { favorites: new ObjectId(movieId) as any } }
      );
    } else {
      // Ajouter aux favoris
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.id) as any },
        { $addToSet: { favorites: new ObjectId(movieId) as any } }
      );
    }

    return NextResponse.json({
      success: true,
      isFavorite: !user
    });

  } catch (error) {
    console.error('Erreur modification favoris:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
