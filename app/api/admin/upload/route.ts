// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token d\'authentification requis' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Accès admin requis' 
      }, { status: 403 });
    }

    // Récupérer les données du formulaire
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' ou 'image'

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'Aucun fichier fourni' 
      }, { status: 400 });
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type de fichier invalide (video ou image requis)' 
      }, { status: 400 });
    }

    // Vérifier la taille du fichier (max 100MB pour vidéo, 10MB pour image)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: `Fichier trop volumineux. Maximum: ${type === 'video' ? '100MB' : '10MB'}` 
      }, { status: 400 });
    }

    // Vérifier le type MIME
    const allowedMimes = type === 'video' 
      ? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: `Type de fichier non autorisé. Types acceptés: ${allowedMimes.join(', ')}` 
      }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;

    // Déterminer le dossier de destination (dans la racine du projet)
    const uploadDir = type === 'video' ? 'secure-media/videos' : 'secure-media/images';
    const uploadPath = join(process.cwd(), uploadDir);

    // Créer le dossier s'il n'existe pas
    try {
      await mkdir(uploadPath, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà, continuer
    }

    // Sauvegarder le fichier
    const filePath = join(uploadPath, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // Retourner l'URL du fichier (sans le préfixe secure-media car il sera ajouté par l'API secure-media)
    const fileUrl = fileName;

    console.log(`✅ Fichier uploadé: ${fileUrl}`);

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        uploadType: type
      },
      message: 'Fichier uploadé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur lors de l\'upload' 
    }, { status: 500 });
  }
}
