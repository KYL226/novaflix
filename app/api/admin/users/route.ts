// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { db } from '@/lib/models';
import { withAdminAuth } from '@/lib/withAdminAuth';

export async function GET(req: NextRequest) {
  const auth = await withAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const subscription = searchParams.get('subscription');

  try {
    const usersCollection = await db.getUsers();
    const query: any = {};
    
    if (role) query.role = role;
    if (subscription) query.subscription = subscription;

    const users = await usersCollection
      .find(query)
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Optionnel : PATCH pour mettre à jour un utilisateur
export async function PATCH(req: NextRequest) {
  const auth = await withAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const { id, role, subscription, banned } = await req.json();
    
    // Valider l'ID MongoDB
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID utilisateur invalide' }, { status: 400 });
    }

    const users = await db.getUsers();

    const updateFields: any = {};
    if (role !== undefined) updateFields.role = role;
    if (subscription !== undefined) updateFields.subscription = subscription;
    if (banned !== undefined) updateFields.banned = banned;
    updateFields.updatedAt = new Date();

    const result = await users.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Utilisateur mis à jour' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}