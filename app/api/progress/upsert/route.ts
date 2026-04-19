import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { upsertProgressSchema } from "@/lib/validators/progress";
import { requireAuth } from "@/services/authz";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const parsed = upsertProgressSchema.parse(payload);

    const progress = await db.progress.upsert({
      where: {
        userId_contentId: {
          userId: user.id,
          contentId: parsed.contentId,
        },
      },
      update: {
        lastPosition: parsed.lastPosition,
        isCompleted: parsed.isCompleted,
      },
      create: {
        userId: user.id,
        contentId: parsed.contentId,
        lastPosition: parsed.lastPosition,
        isCompleted: parsed.isCompleted,
      },
    });

    return ok({ progress });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      return fail(error.message, 400);
    }
    return fail("Progress update failed", 500);
  }
}
