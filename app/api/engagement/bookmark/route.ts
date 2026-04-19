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
          type: "BOOKMARK",
        },
      },
    });

    if (existing) {
      await db.$transaction([
        db.engagement.delete({ where: { id: existing.id } }),
        db.content.update({
          where: { id: parsed.contentId },
          data: { bookmarksCount: { decrement: 1 } },
        }),
      ]);
      return ok({ bookmarked: false });
    }

    await db.$transaction([
      db.engagement.create({
        data: {
          contentId: parsed.contentId,
          userId: user.id,
          type: "BOOKMARK",
        },
      }),
      db.content.update({
        where: { id: parsed.contentId },
        data: { bookmarksCount: { increment: 1 } },
      }),
    ]);

    return ok({ bookmarked: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return ok({ bookmarked: true });
    }
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      return fail(error.message, 400);
    }
    return fail("Bookmark toggle failed", 500);
  }
}
