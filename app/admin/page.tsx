"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

type ContentRecord = {
  id: string;
  title: string;
  slug: string;
  type: "VIDEO" | "ARTICLE";
};

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"VIDEO" | "ARTICLE">("VIDEO");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [body, setBody] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [regenerateSlug, setRegenerateSlug] = useState(false);

  const contentQuery = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const response = await fetch("/api/admin/content");
      if (!response.ok) throw new Error("Only admins can access this page.");
      return (await response.json()) as { items: ContentRecord[] };
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          videoUrl: videoUrl || null,
          thumbnail: thumbnail || null,
          body: body || null,
          readTime,
          regenerateSlug,
        }),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Failed");
      return response.json();
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnail("");
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-content"] }),
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1.2fr_1fr] md:px-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <h1 className="text-xl font-semibold">Admin Content Control</h1>
        <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "VIDEO" | "ARTICLE")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="VIDEO">VIDEO</option>
            <option value="ARTICLE">ARTICLE</option>
          </select>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL (for VIDEO)"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Thumbnail URL"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Article body (for ARTICLE)"
            className="min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <input
            value={readTime}
            onChange={(e) => setReadTime(Number(e.target.value))}
            type="number"
            min={1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={regenerateSlug}
              onChange={(e) => setRegenerateSlug(e.target.checked)}
            />
            Regenerate slug from title
          </label>
          <button
            disabled={createMutation.isPending}
            className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
          >
            {createMutation.isPending ? "Saving..." : "Create Content"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <h2 className="mb-3 text-lg font-semibold">Existing Content</h2>
        <div className="space-y-2">
          {contentQuery.data?.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <p className="text-xs text-slate-600 dark:text-slate-300">{item.type}</p>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">{item.slug}</p>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                className="mt-2 rounded bg-rose-400 px-2 py-1 text-xs font-semibold text-slate-900"
              >
                Delete
              </button>
            </div>
          ))}
          {contentQuery.isLoading && <div className="h-20 animate-pulse rounded bg-slate-200 dark:bg-white/10" />}
        </div>
      </section>
    </main>
  );
}
