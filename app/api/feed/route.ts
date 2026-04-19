import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { feedQuerySchema } from "@/lib/validators/feed";
import { getFeed } from "@/services/feed-service";
import { fail, ok } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = feedQuerySchema.parse(params);
    const session = await getServerSession(authOptions);
    const result = await getFeed({
      ...parsed,
      userId: session?.user?.id,
    });
    return ok(result);
  } catch (error) {
    if (error instanceof Error) return fail(error.message, 400);
    return fail("Failed to fetch feed", 500);
  }
}
