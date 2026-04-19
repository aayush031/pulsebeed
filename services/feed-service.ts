import { db } from "@/lib/db";

const TRENDING_WINDOW_HOURS = 72;

function trendStartDate() {
  const d = new Date();
  d.setHours(d.getHours() - TRENDING_WINDOW_HOURS);
  return d;
}

export async function getFeed(params: {
  userId?: string;
  cursor?: string;
  type?: "VIDEO" | "ARTICLE";
  sort: "latest" | "trending";
  limit: number;
}) {
  const where = {
    ...(params.type ? { type: params.type } : {}),
  };

  const take = params.limit + 1;
  const cursor = params.cursor ? { id: params.cursor } : undefined;

  const items = await db.content.findMany({
    where,
    take,
    ...(cursor ? { cursor, skip: 1 } : {}),
    orderBy:
      params.sort === "latest"
        ? { createdAt: "desc" }
        : [{ viewCount: "desc" }, { createdAt: "desc" }],
    include: {
      engagements: {
        where: params.userId
          ? { userId: params.userId, type: { in: ["LIKE", "BOOKMARK"] } }
          : { userId: "__none__" },
        select: { type: true },
      },
    },
  });

  const hasMore = items.length > params.limit;
  const sliced = hasMore ? items.slice(0, params.limit) : items;

  let trendingMap = new Map<string, number>();
  if (params.sort === "trending") {
    const records = await db.engagement.groupBy({
      by: ["contentId", "type"],
      where: {
        contentId: { in: sliced.map((x) => x.id) },
        createdAt: { gte: trendStartDate() },
      },
      _count: {
        _all: true,
      },
    });

    trendingMap = records.reduce((acc, row) => {
      const current = acc.get(row.contentId) ?? 0;
      const weight = row.type === "LIKE" ? 3 : 2;
      acc.set(row.contentId, current + row._count._all * weight);
      return acc;
    }, new Map<string, number>());
  }

  const data = sliced
    .map((content) => {
      const liked = content.engagements.some((x) => x.type === "LIKE");
      const bookmarked = content.engagements.some((x) => x.type === "BOOKMARK");
      return {
        id: content.id,
        title: content.title,
        slug: content.slug,
        description: content.description,
        type: content.type,
        thumbnail: content.thumbnail,
        likesCount: content.likesCount,
        bookmarksCount: content.bookmarksCount,
        viewCount: content.viewCount,
        createdAt: content.createdAt,
        liked,
        bookmarked,
        trendingScore:
          params.sort === "trending"
            ? (trendingMap.get(content.id) ?? 0) + content.viewCount
            : null,
      };
    })
    .sort((a, b) => {
      if (params.sort !== "trending") return 0;
      return (b.trendingScore ?? 0) - (a.trendingScore ?? 0);
    });

  return {
    items: data,
    nextCursor: hasMore ? items[params.limit].id : null,
  };
}
