"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/types";

type FeedResponse = {
  items: FeedItem[];
  nextCursor: string | null;
};

type FeedInfiniteData = InfiniteData<FeedResponse, string | null>;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error((await response.json()).error ?? "Request failed");
  return response.json();
}

export function FeedClient() {
  const [typeFilter, setTypeFilter] = useState<"ALL" | "VIDEO" | "ARTICLE">("ALL");
  const [sort, setSort] = useState<"latest" | "trending">("latest");
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();

  const feedQuery = useInfiniteQuery({
    queryKey: ["feed", typeFilter, sort],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({
        sort,
        limit: "8",
      });
      if (pageParam) params.set("cursor", pageParam);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      return fetchJson<FeedResponse>(`/api/feed?${params.toString()}`);
    },
    getNextPageParam: (last) => last.nextCursor,
  });

  const searchQuery = useQuery({
    queryKey: ["search", q],
    queryFn: () => fetchJson<{ items: FeedItem[] }>(`/api/search?q=${encodeURIComponent(q)}`),
    enabled: q.trim().length > 0,
  });

  const mutateLike = useMutation({
    mutationFn: (contentId: string) =>
      fetchJson<{ liked: boolean }>("/api/engagement/like", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId }),
      }),
    onMutate: async (contentId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      const previous = queryClient.getQueriesData({ queryKey: ["feed"] });
      for (const [key] of previous) {
        queryClient.setQueryData(key, (old: FeedInfiniteData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: FeedResponse) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === contentId
                  ? {
                      ...item,
                      liked: !item.liked,
                      likesCount: item.liked ? item.likesCount - 1 : item.likesCount + 1,
                    }
                  : item
              ),
            })),
          };
        });
      }
      return { previous };
    },
    onError: (_error, _vars, context) => {
      for (const [key, value] of context?.previous ?? []) {
        queryClient.setQueryData(key, value);
      }
    },
  });

  const mutateBookmark = useMutation({
    mutationFn: (contentId: string) =>
      fetchJson<{ bookmarked: boolean }>("/api/engagement/bookmark", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId }),
      }),
    onMutate: async (contentId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      const previous = queryClient.getQueriesData({ queryKey: ["feed"] });
      for (const [key] of previous) {
        queryClient.setQueryData(key, (old: FeedInfiniteData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: FeedResponse) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === contentId
                  ? {
                      ...item,
                      bookmarked: !item.bookmarked,
                      bookmarksCount: item.bookmarked
                        ? item.bookmarksCount - 1
                        : item.bookmarksCount + 1,
                    }
                  : item
              ),
            })),
          };
        });
      }
      return { previous };
    },
    onError: (_error, _vars, context) => {
      for (const [key, value] of context?.previous ?? []) {
        queryClient.setQueryData(key, value);
      }
    },
  });

  const feedItems = useMemo(() => feedQuery.data?.pages.flatMap((page) => page.items) ?? [], [feedQuery.data]);
  const items = q.trim().length > 0 ? (searchQuery.data?.items ?? []) : feedItems;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-bold md:text-3xl">Discover Pulsebeed</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Watch practical videos and read in-depth engineering articles in one unified stream.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["ALL", "VIDEO", "ARTICLE"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTypeFilter(item)}
              className={`rounded-full px-3 py-1 text-sm ${
                typeFilter === item
                  ? "bg-cyan-400 text-slate-900"
                  : "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => setSort(sort === "latest" ? "trending" : "latest")}
            className="rounded-full bg-orange-300 px-3 py-1 text-sm font-semibold text-slate-900"
          >
            Sort: {sort}
          </button>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title..."
          className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
        />
      </section>

      {(feedQuery.isLoading || searchQuery.isLoading) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-36 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>{item.type}</span>
              <span>{item.viewCount} views</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {item.description ??
                (item.type === "VIDEO"
                  ? "A focused walkthrough with practical examples and clear implementation steps."
                  : "A long-form breakdown with architecture decisions, tradeoffs, and production tips.")}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => mutateLike.mutate(item.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  item.liked
                    ? "bg-rose-400 text-slate-900"
                    : "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-100"
                }`}
              >
                ❤ {item.likesCount}
              </button>
              <button
                onClick={() => mutateBookmark.mutate(item.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  item.bookmarked
                    ? "bg-amber-300 text-slate-900"
                    : "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-100"
                }`}
              >
                ★ {item.bookmarksCount}
              </button>
              <Link
                href={`/content/${item.slug}`}
                className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
              >
                {item.type === "VIDEO" ? "Watch" : "Read"}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {q.trim().length === 0 && (
        <div className="mt-6 flex justify-center">
          <button
            disabled={!feedQuery.hasNextPage || feedQuery.isFetchingNextPage}
            onClick={() => feedQuery.fetchNextPage()}
            className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-900 disabled:opacity-60"
          >
            {feedQuery.isFetchingNextPage ? "Loading..." : feedQuery.hasNextPage ? "Load more" : "No more"}
          </button>
        </div>
      )}
    </main>
  );
}
