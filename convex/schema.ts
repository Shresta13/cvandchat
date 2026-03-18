import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name:         v.string(),
    email:        v.string(),
    passwordHash: v.string(),
    createdAt:    v.number(),
  }).index('by_email', ['email']),

  resumes: defineTable({
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
    projects:         v.optional(v.string()),
    references:       v.optional(v.string()),
    selectedTemplate: v.string(),
  }).index('by_userId', ['userId']),
});