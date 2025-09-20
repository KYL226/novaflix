// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { hashPassword, generateToken } from '@/lib/auth';
import { User, UserForToken } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation simple
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const users = await db.getUsers();
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      subscription: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    (userWithoutPassword as any)._id = result.insertedId;

    // Créer l'objet utilisateur complet pour le token
    const userForToken: UserForToken = {
      _id: result.insertedId.toString(),
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      subscription: userWithoutPassword.subscription
    };

    // Générer un token pour connecter automatiquement l'utilisateur
    const token = generateToken(userForToken);

    return NextResponse.json(
      { 
        user: userWithoutPassword,
        token: token
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}