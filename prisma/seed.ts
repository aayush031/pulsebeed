import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

type CuratedContent = {
  title: string;
  slug: string;
  type: "VIDEO" | "ARTICLE";
  description: string;
  videoUrl: string | null;
  thumbnail: string;
  body: string | null;
  readTime: number;
};

const curatedContent: CuratedContent[] = [
  {
    title: "System Design: Build a High-Scale News Feed with Caching",
    slug: "system-design-high-scale-news-feed-caching",
    type: "VIDEO",
    description:
      "Design a resilient feed architecture with Redis fan-out strategies, ranking layers, and read-optimized storage.",
    videoUrl: "https://www.youtube.com/watch?v=HCEfUq8r1o8",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    body: null,
    readTime: 12,
  },
  {
    title: "Prisma at Scale: Avoiding N+1 Queries in Real Production APIs",
    slug: "prisma-at-scale-avoiding-n-plus-1-queries",
    type: "ARTICLE",
    description:
      "A practical guide to query shaping with include/select, relation batching, and profile-driven optimizations.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    body:
      "N+1 is one of the easiest performance bugs to ship and one of the hardest to notice early. In Prisma, N+1 often appears when list endpoints call relation queries inside loops. The fix is to model response shape first, then use include/select strategically to fetch exactly what the UI needs in one round trip.\n\nFor feed-like APIs, create typed DTOs and use relation filters for user-specific state. Use aggregate queries for counts and groupBy when ranking by engagement. Profile with realistic datasets before deployment and validate generated SQL for expensive scans.\n\nAt scale, thoughtful query shape beats brute-force hardware. Performance becomes predictable when each endpoint has deterministic query count and bounded payload size.",
    readTime: 9,
  },
  {
    title: "NextAuth Deep Dive: Secure Session Strategies for Modern Apps",
    slug: "nextauth-deep-dive-secure-session-strategies",
    type: "VIDEO",
    description:
      "Understand JWT vs database sessions, provider configuration, and secure auth flows for App Router projects.",
    videoUrl: "https://www.youtube.com/watch?v=1MTyCvS05V4",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    body: null,
    readTime: 10,
  },
  {
    title: "PostgreSQL Trigram Search for Sub-10ms Title Lookup",
    slug: "postgresql-trigram-search-sub-10ms-title-lookup",
    type: "ARTICLE",
    description:
      "How to set up pg_trgm + GIN indexes, tune search queries, and keep relevance stable as data grows.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    body:
      "Full-text search can be overkill for simple title lookup workflows. For medium datasets, trigram indexes often provide a cleaner path with fast fuzzy matching. Start by enabling pg_trgm and creating a GIN index on the searchable column.\n\nUse ILIKE with `%query%` for broad matching, then order by engagement or recency. Keep query terms normalized and trimmed in the API layer. For best results, combine trigram indexing with cursor pagination to avoid expensive OFFSET scans.\n\nThe outcome is a search box that stays responsive even as content volume grows from hundreds to tens of thousands of rows.",
    readTime: 8,
  },
  {
    title: "Cursor Pagination vs Offset: The Definitive Benchmark",
    slug: "cursor-pagination-vs-offset-definitive-benchmark",
    type: "VIDEO",
    description:
      "Real benchmarks on why cursor-based feeds stay fast while offset degrades with deep pages.",
    videoUrl: "https://www.youtube.com/watch?v=ZWw6wZP3b8M",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    body: null,
    readTime: 11,
  },
  {
    title: "Optimistic UI Without Data Corruption",
    slug: "optimistic-ui-without-data-corruption",
    type: "ARTICLE",
    description:
      "A robust mutation pattern with rollback, idempotency keys, and conflict-safe backend operations.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    body:
      "Optimistic interfaces feel instant, but they can drift from server truth without safeguards. Start by updating the local cache immediately, then enqueue the request with retry-aware error handling. On failure, rollback state using a preserved snapshot.\n\nThe backend must be idempotent. Use unique constraints or semantic idempotency keys so repeated clicks cannot corrupt counters. Combine this with atomic increments and transactional writes to guarantee consistency.\n\nDone right, optimistic UX improves perceived speed while preserving strict data integrity.",
    readTime: 7,
  },
  {
    title: "Debounced Progress Sync for Video and Reading Experiences",
    slug: "debounced-progress-sync-video-reading-experiences",
    type: "VIDEO",
    description:
      "Implement smooth progress tracking with reduced write load using debounce + unmount flush.",
    videoUrl: "https://www.youtube.com/watch?v=Rj6M5f8Q-7M",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    body: null,
    readTime: 9,
  },
  {
    title: "Designing Admin Workflows for SEO-Safe Slugs",
    slug: "designing-admin-workflows-for-seo-safe-slugs",
    type: "ARTICLE",
    description:
      "Prevent broken links by making slug regeneration explicit and auditable in content operations.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    body:
      "Slug policy often becomes inconsistent once editorial teams scale. The safest default is to keep slug stable on title edits unless an explicit regeneration flag is set.\n\nExpose this behavior clearly in the admin UI and include conflict checks before updates. For changed slugs, build optional redirects to preserve inbound traffic and ranking.\n\nTreat slug lifecycle as part of product reliability, not just formatting.",
    readTime: 6,
  },
  {
    title: "Build a Recommendation Layer with Freshness and Diversity",
    slug: "build-recommendation-layer-freshness-diversity",
    type: "VIDEO",
    description:
      "Balance personalization, freshness, and topic diversity so users keep discovering relevant content.",
    videoUrl: "https://www.youtube.com/watch?v=jM3t0Q9P4N4",
    thumbnail: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
    body: null,
    readTime: 11,
  },
  {
    title: "Prisma Transactions for Race-Safe Engagement Counters",
    slug: "prisma-transactions-race-safe-engagement-counters",
    type: "ARTICLE",
    description:
      "How to combine unique constraints, transactional writes, and atomic increments for likes/bookmarks.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1515876305430-f06edab8282a",
    body:
      "Engagement systems receive bursty, duplicate interactions. Use a unique index on user-content-type and write all side effects in a transaction. Increment counters atomically, not via read-modify-write. This keeps counts accurate under concurrency.",
    readTime: 7,
  },
  {
    title: "Neon + Prisma Production Setup: Connection Pooling Done Right",
    slug: "neon-prisma-production-setup-connection-pooling",
    type: "VIDEO",
    description:
      "Configure DATABASE_URL and pooling semantics for stable serverless and long-lived environments.",
    videoUrl: "https://www.youtube.com/watch?v=0k8K8tQ3W98",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    body: null,
    readTime: 8,
  },
  {
    title: "App Router Route Handlers: Patterns for Scalable APIs",
    slug: "app-router-route-handlers-patterns-scalable-apis",
    type: "ARTICLE",
    description:
      "Structure validation, auth checks, and service-layer orchestration for maintainable endpoint growth.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
    body:
      "Keep route handlers thin: parse input with Zod, call domain services, and return typed responses. Move business logic into dedicated service modules to avoid duplicated behavior across endpoints.",
    readTime: 6,
  },
  {
    title: "React Query Infinite Feeds with Optimistic Mutations",
    slug: "react-query-infinite-feeds-optimistic-mutations",
    type: "VIDEO",
    description:
      "Build snappy content feeds with cache-aware pagination and rollback-safe optimistic updates.",
    videoUrl: "https://www.youtube.com/watch?v=lmK0b0vM4C0",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    body: null,
    readTime: 10,
  },
  {
    title: "High-Impact SEO for Content Platforms",
    slug: "high-impact-seo-for-content-platforms",
    type: "ARTICLE",
    description:
      "Practical SEO foundations: metadata discipline, canonical URLs, and slug consistency at scale.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07",
    body:
      "Content SEO starts with deterministic URLs, consistent metadata, and stable internal linking. Avoid accidental slug drift, duplicate pages, and soft-404 behavior in admin workflows.",
    readTime: 5,
  },
  {
    title: "Designing Fast Search UX for 10K+ Content Records",
    slug: "designing-fast-search-ux-for-10k-content-records",
    type: "VIDEO",
    description:
      "Reduce perceived latency with debounced queries, optimistic previews, and lightweight result cards.",
    videoUrl: "https://www.youtube.com/watch?v=7M8x0n7VQfY",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    body: null,
    readTime: 9,
  },
  {
    title: "Auth Roles in NextAuth: User vs Admin with Confidence",
    slug: "auth-roles-nextauth-user-vs-admin",
    type: "ARTICLE",
    description:
      "Implement role-aware session callbacks and server-side guards without leaking privileged actions.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    body:
      "Role data should be available in session and verified again server-side before sensitive mutations. Always authorize in APIs even if UI hides admin controls.",
    readTime: 6,
  },
  {
    title: "Practical Caching for Feed APIs",
    slug: "practical-caching-for-feed-apis",
    type: "VIDEO",
    description:
      "Where to cache feed slices, when to invalidate, and how to keep personalization intact.",
    videoUrl: "https://www.youtube.com/watch?v=G8f4dMXLxY4",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    body: null,
    readTime: 8,
  },
  {
    title: "Atomic Operations in PostgreSQL: What Actually Matters",
    slug: "atomic-operations-in-postgresql-what-actually-matters",
    type: "ARTICLE",
    description:
      "A concise guide to transaction safety, isolation basics, and contention-aware write design.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1551281044-8d8d7f7f5ef0",
    body:
      "Atomic increments and transactional writes eliminate common race conditions in social interaction flows. Model your write paths so each user action maps to one reliable transaction boundary.",
    readTime: 7,
  },
  {
    title: "Designing a Continue Watching Experience Users Love",
    slug: "designing-continue-watching-experience-users-love",
    type: "VIDEO",
    description:
      "Implement sticky progress, completion rules, and cross-device resume behavior for media products.",
    videoUrl: "https://www.youtube.com/watch?v=XlyT0QxT5qY",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    body: null,
    readTime: 8,
  },
  {
    title: "From Prototype to Production: Hardening a Content Platform",
    slug: "prototype-to-production-hardening-content-platform",
    type: "ARTICLE",
    description:
      "A pragmatic checklist for reliability, observability, and operational readiness before launch.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    body:
      "Before launch, validate migrations, auth edge cases, and error handling. Add instrumentation for key endpoints and define SLO targets for feed and search latency.",
    readTime: 6,
  },
  {
    title: "How Trending Algorithms Actually Work",
    slug: "how-trending-algorithms-actually-work",
    type: "VIDEO",
    description:
      "Build weighted scoring models that combine recency, engagement quality, and anti-spam controls.",
    videoUrl: "https://www.youtube.com/watch?v=hg6bq2oE2vM",
    thumbnail: "https://images.unsplash.com/photo-1518186233392-c232efbf2373",
    body: null,
    readTime: 10,
  },
  {
    title: "Schema Design for Mixed Video and Article Platforms",
    slug: "schema-design-mixed-video-article-platforms",
    type: "ARTICLE",
    description:
      "Normalize shared content fields while preserving type-specific fields for clean querying and evolution.",
    videoUrl: null,
    thumbnail: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56",
    body:
      "Model shared behavior at the content level and isolate type-specific fields where needed. This keeps feed queries simple and enables type-safe rendering without overfetching.",
    readTime: 7,
  },
  {
    title: "Production Debugging: Finding Slow API Paths Quickly",
    slug: "production-debugging-finding-slow-api-paths-quickly",
    type: "VIDEO",
    description:
      "Use logs, timings, and query inspection to diagnose bottlenecks in feed and search endpoints.",
    videoUrl: "https://www.youtube.com/watch?v=fVK7l0V6w7M",
    thumbnail: "https://images.unsplash.com/photo-1451187863213-d1bcbaae3fa3",
    body: null,
    readTime: 9,
  },
];

function randomOldDate() {
  const daysAgo = faker.number.int({ min: 120, max: 1200 });
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "admin@pulsebeed.com";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Pulsebeed Admin",
      role: "ADMIN",
    },
  });

  const users = await Promise.all(
    Array.from({ length: 30 }).map((_, index) =>
      prisma.user.upsert({
        where: { email: `user${index}@pulsebeed.dev` },
        update: {},
        create: {
          email: `user${index}@pulsebeed.dev`,
          name: faker.person.fullName(),
          role: "USER",
        },
      })
    )
  );

  // Reset content domain tables so curated items reliably appear on top in latest feed.
  await prisma.progress.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.content.deleteMany();

  const now = new Date();
  for (let i = 0; i < curatedContent.length; i++) {
    const item = curatedContent[i];
    const createdAt = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
    await prisma.content.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        type: item.type,
        videoUrl: item.videoUrl,
        thumbnail: item.thumbnail,
        body: item.body,
        readTime: item.readTime,
      },
      create: {
        ...item,
        likesCount: faker.number.int({ min: 120, max: 2200 }),
        bookmarksCount: faker.number.int({ min: 80, max: 1600 }),
        viewCount: faker.number.int({ min: 10_000, max: 280_000 }),
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  const contentBatchSize = 500;
  const total = 10_000 - curatedContent.length;
  for (let i = 0; i < total; i += contentBatchSize) {
    await prisma.content.createMany({
      data: Array.from({ length: contentBatchSize }).map(() => {
        const type = faker.helpers.arrayElement(["VIDEO", "ARTICLE"] as const);
        const title = faker.lorem.sentence({ min: 4, max: 10 });
        const createdAt = randomOldDate();
        return {
          title,
          slug: `${title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}-${faker.string.alphanumeric(6)}`,
          type,
          description: faker.lorem.paragraph(),
          videoUrl: type === "VIDEO" ? faker.internet.url() : null,
          thumbnail: faker.image.urlPicsumPhotos(),
          body: type === "ARTICLE" ? faker.lorem.paragraphs({ min: 4, max: 12 }) : null,
          readTime: faker.number.int({ min: 2, max: 18 }),
          likesCount: faker.number.int({ min: 0, max: 500 }),
          bookmarksCount: faker.number.int({ min: 0, max: 400 }),
          viewCount: faker.number.int({ min: 100, max: 40_000 }),
          createdAt,
          updatedAt: createdAt,
        };
      }),
      skipDuplicates: true,
    });
  }

  const contentIds = (await prisma.content.findMany({ select: { id: true }, take: 5000 })).map(
    (item) => item.id
  );
  const everyone = [admin, ...users];

  await prisma.engagement.createMany({
    data: Array.from({ length: 6000 }).map(() => {
      const user = faker.helpers.arrayElement(everyone);
      return {
        userId: user.id,
        contentId: faker.helpers.arrayElement(contentIds),
        type: faker.helpers.arrayElement(["LIKE", "BOOKMARK"] as const),
      };
    }),
    skipDuplicates: true,
  });

  await prisma.progress.createMany({
    data: Array.from({ length: 3000 }).map(() => {
      const user = faker.helpers.arrayElement(everyone);
      return {
        userId: user.id,
        contentId: faker.helpers.arrayElement(contentIds),
        lastPosition: faker.number.int({ min: 0, max: 1200 }),
        isCompleted: faker.datatype.boolean({ probability: 0.2 }),
      };
    }),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
