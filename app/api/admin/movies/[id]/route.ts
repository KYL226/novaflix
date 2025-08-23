// app/api/admin/movies/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { withAdminAuth } from '@/lib/withAdminAuth';

// GET: Obtenir un film par ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const movies = await db.getMovies();
    const movie = await movies.findOne({ _id: params.id });
    if (!movie) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: movie });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: Mettre à jour un film
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, genre, duration, releaseYear, type, videoUrl, posterUrl } = body;

    if (!title || !description || !genre || !type || !videoUrl || !posterUrl) {
      return NextResponse.json({ error: 'Tous les champs requis' }, { status: 400 });
    }

    const movies = await db.getMovies();
    const result = await movies.updateOne(
      { _id: params.id },
      {
        $set: {
          title,
          description,
          genre: Array.isArray(genre) ? genre : [genre],
          duration: Number(duration),
          releaseYear: Number(releaseYear),
          type,
          videoUrl,
          posterUrl,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Film mis à jour' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Supprimer un film
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const movies = await db.getMovies();
    const result = await movies.deleteOne({ _id: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Film supprimé' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}