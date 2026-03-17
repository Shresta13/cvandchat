import { cookies } from 'next/headers';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth')?.value;
  if (!userId) return null;

  try {
    const user = await convex.query(api.users.getUserById, {
      userId: userId as Id<'users'>,
    });
    if (!user) return null;

    return {
      id:    user._id as string,
      name:  user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}