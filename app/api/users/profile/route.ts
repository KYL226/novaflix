import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
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

    const { name, email, avatar } = await req.json();

    if (!name || !email) {
      return NextResponse.json({
        error: 'Nom et email sont requis'
      }, { status: 400 });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Format d\'email invalide'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('novaflix');
    
    // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
    const existingUser = await db.collection('users').findOne({
      email,
      _id: { $ne: new ObjectId(decoded.id) as any }
    });

    if (existingUser) {
      return NextResponse.json({
        error: 'Cet email est déjà utilisé par un autre compte'
      }, { status: 409 });
    }

    // Mettre à jour le profil
    const updateData: any = {
      name,
      email,
      updatedAt: new Date()
    };

    if (avatar) {
      updateData.avatar = avatar;
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.id) as any },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await db.collection('users').findOne({
      _id: new ObjectId(decoded.id) as any
    });

    if (!updatedUser) {
      return NextResponse.json({
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser as any;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        message: 'Profil mis à jour avec succès'
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour du profil'
    }, { status: 500 });
  }
}
