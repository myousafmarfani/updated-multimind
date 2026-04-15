import { z } from "zod";

export const conversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(20_000),
});

export const modelRequestSchema = z.object({
  prompt: z.string().min(1).max(20_000),
  instructions: z.string().max(10_000).optional(),
  conversationHistory: z.array(conversationMessageSchema).max(40).optional(),
  userName: z.string().max(120).optional(),
});

export const improvePromptSchema = z.object({
  prompt: z.string().min(1).max(20_000),
});

export type ModelRequestInput = z.infer<typeof modelRequestSchema>;
