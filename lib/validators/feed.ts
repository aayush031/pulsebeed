import { z } from "zod";

export const feedQuerySchema = z.object({
  cursor: z.string().optional(),
  type: z.enum(["VIDEO", "ARTICLE"]).optional(),
  sort: z.enum(["latest", "trending"]).default("latest"),
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});
