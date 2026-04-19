import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { searchQuerySchema } from "@/lib/validators/feed";
import { fail, ok } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = searchQuerySchema.parse(params);

    const items = await db.content.findMany({
      where: {
        title: {
          contains: parsed.q,
          mode: "insensitive",
        },
      },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      take: parsed.limit,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        thumbnail: true,
        viewCount: true,
      },
    });

    return ok({ items });
  } catch (error) {
    if (error instanceof Error) return fail(error.message, 400);
    return fail("Search failed", 500);
  }
}
