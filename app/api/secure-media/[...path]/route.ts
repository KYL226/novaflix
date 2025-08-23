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
      // Extraire le token d'autorisation depuis les headers ou cookies
      let token = null;
      
      // Essayer d'abord les headers
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
      
      // Si pas de token dans les headers, essayer les cookies
      if (!token) {
        const cookies = req.headers.get('cookie');
        if (cookies) {
          const tokenMatch = cookies.match(/token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
          }
        }
      }
      
      // Si pas de token dans les cookies, essayer les paramètres de requête
      if (!token) {
        const url = new URL(req.url);
        token = url.searchParams.get('token');
      }

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