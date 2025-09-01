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
    console.log('📁 Demande d\'accès au fichier:', filePath);

    // Construire le chemin complet du fichier
    const secureMediaDir = path.join(process.cwd(), 'secure-media');
    const fullPath = path.join(secureMediaDir, filePath);

    console.log('📍 Chemin complet:', fullPath);

    // Autoriser les images sans auth, mais garder les vidéos protégées
    const isImage = filePath.startsWith('images/');
    const isVideo = filePath.startsWith('videos/');

    if (!isImage) {
      // Extraire le token d'autorisation depuis les headers, cookies ou paramètres
      let token = null;
      
      // 1. Essayer d'abord les paramètres de requête (priorité pour les vidéos)
      const url = new URL(req.url);
      token = url.searchParams.get('token');
      if (token) {
        console.log('🔗 Token trouvé dans les paramètres de requête');
        console.log('🔍 Token (premiers caractères):', token.substring(0, 20) + '...');
        console.log('🔍 Token (longueur):', token.length);
      } else {
        console.log('❌ Aucun token trouvé dans les paramètres de requête');
        console.log('🔍 Paramètres disponibles:', Array.from(url.searchParams.entries()));
      }
      
      // 2. Si pas de token dans les paramètres, essayer les headers Authorization
      if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
          console.log('🔑 Token trouvé dans les headers Authorization');
        }
      }
      
      // 3. Si pas de token dans les headers, essayer les cookies
      if (!token) {
        const cookies = req.headers.get('cookie');
        if (cookies) {
          const tokenMatch = cookies.match(/token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
            console.log('🍪 Token trouvé dans les cookies');
          }
        }
      }

      // 4. Vérifier si le token existe
      if (!token) {
        console.log('❌ Accès refusé: Aucun token fourni pour', filePath);
        console.log('📋 Headers reçus:', Object.fromEntries(req.headers.entries()));
        console.log('🔗 URL complète:', req.url);
        console.log('🔍 Paramètres de requête:', new URL(req.url).searchParams.toString());
        return new NextResponse('Accès refusé: Token requis', { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Secure Media Access"'
          }
        });
      }

      console.log('🔍 Token trouvé, longueur:', token.length);
      console.log('🔑 Token (premiers caractères):', token.substring(0, 20) + '...');

      // 5. Vérifier la validité du token
      let decoded: any = null;
      try {
        decoded = verifyToken(token);
        if (!decoded) {
          console.log('❌ Accès refusé: Token invalide pour', filePath);
          console.log('🔍 Détails du token invalide:', { 
            tokenLength: token.length,
            tokenStart: token.substring(0, 20) + '...',
            tokenEnd: '...' + token.substring(token.length - 20)
          });
          console.log('🔍 Token complet:', token);
          return new NextResponse('Accès refusé: Token invalide ou expiré', { 
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
            }
          });
        }

        console.log('✅ Token décodé avec succès:', {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          subscription: decoded.subscription,
          iat: new Date(decoded.iat * 1000).toISOString(),
          exp: new Date(decoded.exp * 1000).toISOString(),
          isExpired: Date.now() > decoded.exp * 1000
        });

        // Vérifier si le token a expiré
        if (Date.now() > decoded.exp * 1000) {
          console.log('❌ Accès refusé: Token expiré pour', filePath);
          return new NextResponse('Accès refusé: Token expiré', { 
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
            }
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du token:', error);
        return new NextResponse('Accès refusé: Erreur de vérification du token', { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Secure Media Access", error="invalid_token"'
          }
        });
      }

      // 6. Vérifier l'abonnement de l'utilisateur
      console.log('🔍 Vérification de l\'abonnement:', {
        hasSubscription: !!decoded.subscription,
        subscriptionType: decoded.subscription,
        isFree: decoded.subscription === 'free',
        isBasic: decoded.subscription === 'basic',
        isPremium: decoded.subscription === 'premium'
      });

      // Vérifier que l'utilisateur a un abonnement valide (test ou réel)
      if (!decoded.subscription || decoded.subscription === 'free') {
        console.log('❌ Accès refusé: Abonnement requis pour', filePath, 'User:', decoded.email, 'Subscription:', decoded.subscription);
        return new NextResponse('Accès refusé: Abonnement premium requis pour ce contenu', { 
          status: 403,
          headers: {
            'X-Required-Subscription': 'premium'
          }
        });
      }

      // 7. Log de l'accès autorisé
      console.log(`✅ Accès autorisé: ${decoded.email} (${decoded.subscription}) accède à ${filePath}`);
    }

    // Vérifier que le fichier existe
    if (!existsSync(fullPath)) {
      console.log('❌ Fichier non trouvé:', fullPath);
      return new NextResponse('Fichier non trouvé', { status: 404 });
    }

    console.log('✅ Fichier trouvé, lecture en cours...');

    // Lire le fichier
    const fileBuffer = await readFile(fullPath);
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';

    console.log('📊 Taille du fichier:', fileBuffer.length, 'bytes');
    console.log('🎯 Type MIME:', contentType);

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

    console.log('✅ Fichier envoyé avec succès');
    return response;

  } catch (error) {
    console.error('❌ Erreur accès média sécurisé:', error);
    return new NextResponse('Erreur serveur interne', { status: 500 });
  }
}