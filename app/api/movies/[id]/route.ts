import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'ID du film requis'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('novaflix');
    
    // Vérifier si l'ID est un ObjectId valide
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de film invalide'
      }, { status: 400 });
    }

    const movie = await db.collection('movies').findOne({
      _id: new ObjectId(params.id)
    });

    if (!movie) {
      return NextResponse.json({
        success: false,
        error: 'Film non trouvé'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: movie
    });

  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la récupération du film'
    }, { status: 500 });
  }
}
