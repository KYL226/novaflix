// app/api/secure-media/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Chemin vers le dossier secure-media
const SECURE_MEDIA_DIR = path.join(process.cwd(), 'secure-media');

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Construire le chemin du fichier
    const filePath = params.path.join('/');
    const fullPath = path.join(SECURE_MEDIA_DIR, filePath);

    // Autoriser les images sans auth, mais garder les vidéos protégées
    const isImage = filePath.startsWith('images/');

    if (!isImage) {
      // Extraire le token d'autorisation
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      if (!token) {
        return new NextResponse('Accès refusé', { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return new NextResponse('Token invalide', { status: 401 });
      }

      // Vérifier l'abonnement
      if (!decoded.subscription || decoded.subscription === 'free') {
        return new NextResponse('Abonnement requis', { status: 403 });
      }
    }

    // Vérifier que le fichier existe
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Fichier non trouvé', { status: 404 });
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(fullPath);
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Erreur accès média sécurisé:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}