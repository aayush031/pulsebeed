import { z } from "zod";

export const upsertProgressSchema = z.object({
  contentId: z.string().min(1),
  lastPosition: z.number().int().min(0),
  isCompleted: z.boolean().default(false),
});
