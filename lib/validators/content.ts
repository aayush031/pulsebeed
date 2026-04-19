import { z } from "zod";
import { slugify } from "@/lib/utils";

export const contentMutationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(200),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(["VIDEO", "ARTICLE"]),
  videoUrl: z.string().url().optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  body: z.string().optional().nullable(),
  readTime: z.number().int().min(1).max(180).default(1),
  regenerateSlug: z.boolean().default(false),
  slug: z.string().optional().transform((s) => (s ? slugify(s) : undefined)),
});

export const deleteContentSchema = z.object({
  id: z.string().min(1),
});
