import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";
import {
  contentMutationSchema,
  deleteContentSchema,
} from "@/lib/validators/content";
import { requireAdmin } from "@/services/authz";
import { slugify } from "@/lib/utils";

function resolveSlug(input: {
  title: string;
  providedSlug?: string;
  regenerateSlug?: boolean;
  currentSlug?: string;
}) {
  if (input.providedSlug) return input.providedSlug;
  if (input.regenerateSlug) return slugify(input.title);
  if (input.currentSlug) return input.currentSlug;
  return slugify(input.title);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const parsed = contentMutationSchema.parse(payload);
    const slug = resolveSlug({
      title: parsed.title,
      providedSlug: parsed.slug,
      regenerateSlug: parsed.regenerateSlug,
    });

    const content = await db.content.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        type: parsed.type,
        videoUrl: parsed.videoUrl ?? null,
        thumbnail: parsed.thumbnail ?? null,
        body: parsed.body ?? null,
        readTime: parsed.readTime,
        slug,
      },
    });

    return ok({ content }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      if (error.message === "FORBIDDEN") return fail(error.message, 403);
      return fail(error.message, 400);
    }
    return fail("Failed to create content", 500);
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await db.content.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok({ items });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      if (error.message === "FORBIDDEN") return fail(error.message, 403);
      return fail(error.message, 400);
    }
    return fail("Failed to fetch content", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const parsed = contentMutationSchema.extend({ id: deleteContentSchema.shape.id }).parse(payload);

    const existing = await db.content.findUnique({ where: { id: parsed.id } });
    if (!existing) return fail("Content not found", 404);

    const slug = resolveSlug({
      title: parsed.title,
      providedSlug: parsed.slug,
      regenerateSlug: parsed.regenerateSlug,
      currentSlug: existing.slug,
    });

    const content = await db.content.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        type: parsed.type,
        videoUrl: parsed.videoUrl ?? null,
        thumbnail: parsed.thumbnail ?? null,
        body: parsed.body ?? null,
        readTime: parsed.readTime,
        slug,
      },
    });
    return ok({ content });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      if (error.message === "FORBIDDEN") return fail(error.message, 403);
      return fail(error.message, 400);
    }
    return fail("Failed to update content", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const parsed = deleteContentSchema.parse(payload);

    await db.content.delete({ where: { id: parsed.id } });
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return fail(error.message, 401);
      if (error.message === "FORBIDDEN") return fail(error.message, 403);
      return fail(error.message, 400);
    }
    return fail("Failed to delete content", 500);
  }
}
