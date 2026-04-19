"use client";

import { useEffect, useState } from "react";

type ContentData = {
  id: string;
  title: string;
  type: "VIDEO" | "ARTICLE";
  body: string | null;
  videoUrl: string | null;
};

export function ContentViewer({ content }: { content: ContentData }) {
  const [position, setPosition] = useState(0);
  const articleText =
    content.body?.trim() ||
    "This article section explains the core idea, practical implementation approach, and key tradeoffs. Add your full markdown article content from admin to replace this placeholder.";

  useEffect(() => {
    const timer = setInterval(() => {
      void fetch("/api/progress/upsert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: content.id,
          lastPosition: position,
          isCompleted: false,
        }),
      });
    }, 8000);

    return () => {
      clearInterval(timer);
      void fetch("/api/progress/upsert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: content.id,
          lastPosition: position,
          isCompleted: false,
        }),
      });
    };
  }, [content.id, position]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-bold">{content.title}</h1>
      {content.type === "VIDEO" ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            {content.videoUrl
              ? `Video source: ${content.videoUrl}`
              : "Video source not added yet. Update the content in admin to attach a watch URL."}
          </p>
          <input
            type="range"
            min={0}
            max={1000}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Playback position: {position} seconds
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            Article reading area. Your progress is tracked automatically.
          </p>
          <textarea
            value={articleText}
            onChange={(e) => setPosition(e.target.value.length)}
            className="h-64 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Reading position: {position} characters
          </p>
        </div>
      )}
    </div>
  );
}
