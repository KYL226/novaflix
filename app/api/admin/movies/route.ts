// app/api/admin/movies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { withAdminAuth } from '@/lib/withAdminAuth';

export async function GET() {
  try {
    const auth = await withAdminAuth(new NextRequest('http://localhost/admin'));
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const movies = await db.getMovies();
    const data = await movies.find({}).toArray();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Erreur GET /api/admin/movies:', err);
    return NextResponse.json({ error: 'Erreur serveur lors de la récupération des films' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await withAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await req.json();
    console.log('Données reçues:', body); // Debug

    // Validation des champs requis
    const requiredFields = ['title', 'description', 'genre', 'duration', 'releaseYear', 'type', 'videoUrl', 'posterUrl'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Champs manquants: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validation des types
    const { title, description, genre, duration, releaseYear, type, videoUrl, posterUrl, published } = body;

    // Validation du titre
    if (typeof title !== 'string' || title.trim().length < 1) {
      return NextResponse.json({ error: 'Le titre doit être une chaîne non vide' }, { status: 400 });
    }

    // Validation de la description
    if (typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json({ error: 'La description doit contenir au moins 10 caractères' }, { status: 400 });
    }

    // Validation des genres
    if (!Array.isArray(genre) || genre.length === 0 || !genre.every(g => typeof g === 'string' && g.trim().length > 0)) {
      return NextResponse.json({ error: 'Les genres doivent être un tableau non vide de chaînes' }, { status: 400 });
    }

    // Validation de la durée
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum < 1 || durationNum > 1000) {
      return NextResponse.json({ error: 'La durée doit être un nombre entre 1 et 1000 minutes' }, { status: 400 });
    }

    // Validation de l'année
    const yearNum = Number(releaseYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 5) {
      return NextResponse.json({ error: `L'année doit être entre 1900 et ${currentYear + 5}` }, { status: 400 });
    }

    // Validation du type
    const validTypes = ['film', 'serie', 'documentaire'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Le type doit être l'un de: ${validTypes.join(', ')}` }, { status: 400 });
    }

    // Validation des URLs
    if (typeof videoUrl !== 'string' || videoUrl.trim().length === 0) {
      return NextResponse.json({ error: 'L\'URL de la vidéo est requise' }, { status: 400 });
    }

    if (typeof posterUrl !== 'string' || posterUrl.trim().length === 0) {
      return NextResponse.json({ error: 'L\'URL du poster est requise' }, { status: 400 });
    }

    // Création du film
    const newMovie = {
      title: title.trim(),
      description: description.trim(),
      genre: genre.map(g => g.trim()).filter(g => g.length > 0),
      duration: durationNum,
      releaseYear: yearNum,
      type,
      videoUrl: videoUrl.trim(),
      posterUrl: posterUrl.trim(),
      published: Boolean(published),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Film à créer:', newMovie); // Debug

    const movies = await db.getMovies();
    const result = await movies.insertOne(newMovie);

    if (!result.insertedId) {
      throw new Error('Échec de l\'insertion en base de données');
    }

    console.log('Film créé avec succès, ID:', result.insertedId); // Debug

    return NextResponse.json({
      success: true,
      data: { ...newMovie, _id: result.insertedId },
      message: 'Film créé avec succès'
    }, { status: 201 });

  } catch (err: any) {
    console.error('Erreur POST /api/admin/movies:', err);
    
    // Gestion des erreurs spécifiques
    if (err.name === 'ValidationError') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Un film avec ce titre existe déjà' }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Erreur serveur lors de la création du film',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}