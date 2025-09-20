// app/api/secure-media/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const filePath = params.path.join('/');

    // Construire le chemin complet du fichier
    const secureMediaDir = path.join(process.cwd(), 'secure-media');
    const fullPath = path.join(secureMediaDir, filePath);

    // Autoriser les images sans auth, mais garder les vidéos protégées
    const isImage = filePath.startsWith('images/');

    if (!isImage) {
      // Extraire le token d'autorisation depuis les headers, cookies ou paramètres
      let token = null;
      
      // 1. Essayer d'abord les paramètres de requête (priorité pour les vidéos)
      const url = new URL(req.url);
      token = url.searchParams.get('token');
      
      // 2. Si pas de token dans les paramètres, essayer les headers Authorization
      if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }
      
      // 3. Si pas de token dans les headers, essayer les cookies
      if (!token) {
        const cookies = req.headers.get('cookie');
        if (cookies) {
          const tokenMatch = cookies.match(/token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
          }
        }
      }

      // 4. Vérifier si le token existe
      if (!token) {
        return new NextResponse('Accès refusé: Token requis', { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Secure Media Access"'
          }
        });
      }

      // 5. Vérifier la validité du token
      let decoded: any = null;
      try {
        decoded = verifyToken(token);
        if (!decoded) {
          return new NextResponse('Accès refusé: Token invalide ou expiré', { 
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
            }
          });
        }

        // Vérifier si le token a expiré
        if (Date.now() > decoded.exp * 1000) {
          return new NextResponse('Accès refusé: Token expiré', { 
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
            }
          });
        }
      } catch (error) {
        return new NextResponse('Accès refusé: Erreur de vérification du token', { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
          }
        });
      }

      // 6. Vérifier l'abonnement de l'utilisateur
      // Vérifier que l'utilisateur a un abonnement valide (test ou réel)
      if (!decoded.subscription || decoded.subscription === 'free') {
        return new NextResponse('Accès refusé: Abonnement premium requis pour ce contenu', { 
          status: 403,
          headers: {
            'X-Required-Subscription': 'premium'
          }
        });
      }
    }

    // Vérifier que le fichier existe
    if (!existsSync(fullPath)) {
      return new NextResponse('Fichier non trouvé', { status: 404 });
    }

    // Lire le fichier
    const fileBuffer = await readFile(fullPath);
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';

    // Déterminer les headers de cache appropriés
    const cacheControl = isImage 
      ? 'public, max-age=86400' // Images: cache public pendant 24h
      : 'private, max-age=3600'; // Vidéos: cache privé pendant 1h

    const response = new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

    return response;

  } catch (error) {
    return new NextResponse('Erreur serveur interne', { status: 500 });
  }
}