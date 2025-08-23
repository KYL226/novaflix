// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { verifyPassword, generateToken } from '@/lib/auth';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const users = await db.getUsers();
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}