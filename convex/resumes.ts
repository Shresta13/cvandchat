import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getResume = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('resumes')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();
  },
});

export const saveResume = mutation({
  args: {
    userId:           v.string(),
    fullName:         v.string(),
    email:            v.string(),
    phone:            v.string(),
    location:         v.string(),
    linkedin:         v.string(),
    github:           v.string(),
    summary:          v.string(),
    education:        v.string(),
    experience:       v.string(),
    skills:           v.string(),
    languages:        v.string(),
    certificates:     v.string(),
    selectedTemplate: v.string(),
    projects:         v.optional(v.string()),  // ✅ added
    references:       v.optional(v.string()),  // ✅ added
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('resumes')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert('resumes', args);
    }
  },
});

export const deleteResume = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query('resumes')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});