// app/api/movies/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  const url = new URL(req.url);

  // ✅ Extraire les paramètres depuis l'URL
  const genre = url.searchParams.get('genre');
  const type = url.searchParams.get('type');
  const search = url.searchParams.get('search');
  const limit = url.searchParams.get('limit');

  const query: any = {};

  if (genre) query.genre = { $in: [genre] };
  if (type) query.type = type;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { genre: { $elemMatch: { $regex: search, $options: 'i' } } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const client = await clientPromise;
    const db = client.db('novaflix');
    
    let cursor = db.collection('movies').find(query);
    
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    
    const movies = await cursor.toArray();

    return NextResponse.json({
      success: true,
      data: movies,
      count: movies.length
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch movies' 
    }, { status: 500 });
  }
}
