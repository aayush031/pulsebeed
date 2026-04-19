import { z } from "zod";

export const toggleEngagementSchema = z.object({
  contentId: z.string().min(1),
});
