import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.id),
      'favorites': new ObjectId(movieId)
    });

    return NextResponse.json({
      success: true,
      isFavorite: !!user
    });

  } catch (error) {
    console.error('Erreur vérification favoris:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
