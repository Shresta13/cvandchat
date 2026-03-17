import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      );

    if (password !== confirmPassword)
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );

    if (password.length < 6)
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );

    const passwordHash = await bcrypt.hash(password, 12);

    await convex.mutation(api.users.createUser, {
      name,
      email,
      passwordHash,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Signup failed' },
      { status: 400 }
    );
  }
}