import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const content = await db.content.findUnique({ where: { slug } });
    if (!content) return fail("Not found", 404);

    await db.content.update({
      where: { id: content.id },
      data: { viewCount: { increment: 1 } },
    });

    return ok({ content });
  } catch {
    return fail("Failed to fetch content", 500);
  }
}
