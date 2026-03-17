import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
  },
});

export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const createUser = mutation({
  args: {
    name:         v.string(),
    email:        v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) throw new Error('Email already registered');

    const userId = await ctx.db.insert('users', {
      ...args,
      createdAt: Date.now(),
    });

    return userId;
  },
});