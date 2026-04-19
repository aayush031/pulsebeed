"use client";

import { useQuery } from "@tanstack/react-query";

type ContinueItem = {
  contentId: string;
  lastPosition: number;
  updatedAt: string;
  content: {
    id: string;
    title: string;
    slug: string;
    type: "VIDEO" | "ARTICLE";
    readTime: number;
    thumbnail: string | null;
  };
};

export default function ContinuePage() {
  const query = useQuery({
    queryKey: ["continue"],
    queryFn: async () => {
      const response = await fetch("/api/continue");
      if (!response.ok) throw new Error("Sign in to view progress");
      return (await response.json()) as { items: ContinueItem[] };
    },
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-bold">Continue Watching/Reading</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Resume exactly where you left off.</p>

      <div className="mt-6 space-y-3">
        {query.isLoading && <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />}
        {query.data?.items?.map((item) => (
          <div
            key={item.contentId}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <p className="text-xs text-cyan-700 dark:text-cyan-300">{item.content.type}</p>
            <h2 className="text-lg font-semibold">{item.content.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Last position: {item.lastPosition} {item.content.type === "VIDEO" ? "seconds" : "characters"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
