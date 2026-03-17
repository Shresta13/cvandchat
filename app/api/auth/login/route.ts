import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );

    // ✅ Get user from Convex
    const user = await convex.query(api.users.getUserByEmail, { email });

    if (!user)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );

    // ✅ Store real Convex user ID in cookie
    const cookieStore = await cookies();
    cookieStore.set('auth', user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Login failed' },
      { status: 500 }
    );
  }
}