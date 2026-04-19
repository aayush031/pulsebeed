import { db } from "@/lib/db";
import { toggleEngagementSchema } from "@/lib/validators/engagement";
import { fail, ok } from "@/lib/api-response";
import { requireAuth } from "@/services/authz";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const parsed = toggleEngagementSchema.parse(payload);

    const existing = await db.engagement.findUnique({
      where: {
        userId_contentId_type: {
          userId: user.id,
          contentId: parsed.contentId,
          type: "LIKE",
        },
      },
    });

    if (existing) {
      await db.$transaction([
        db.engagement.delete({ where: { id: existing.id } }),
        db.content.update({
          where: { id: parsed.contentId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return ok({ liked: false });
    }

    await db.$transaction([
      db.engagement.create({
        data: {
          contentId: parsed.contentId,
          userId: user.id,
          type: "LIKE",
        },
      }),
      db.content.update({
        where: { id: parsed.contentId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return ok({ liked: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return ok({ liked: true });
    }
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      return fail(error.message, 400);
    }
    return fail("Like toggle failed", 500);
  }
}
