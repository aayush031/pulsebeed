import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import { requireAuth } from "@/services/authz";

export async function GET() {
  try {
    const user = await requireAuth();

    const items = await db.progress.findMany({
      where: { userId: user.id, isCompleted: false },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            thumbnail: true,
            readTime: true,
          },
        },
      },
    });

    return ok({
      items: items.map((row) => ({
        contentId: row.contentId,
        lastPosition: row.lastPosition,
        updatedAt: row.updatedAt,
        content: row.content,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      return fail(error.message, 400);
    }
    return fail("Failed to fetch continue list", 500);
  }
}
