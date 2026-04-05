import { z } from 'zod';

export const createRoomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).optional(),
  scheduledAt: z.string().optional(),
  maxParticipants: z.number().min(2).max(500).default(50),
  isPasswordProtected: z.boolean().default(false),
  password: z.string().optional(),
});

export const joinRoomSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  password: z.string().optional(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const aiAskSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
});
