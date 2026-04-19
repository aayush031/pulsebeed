import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ContentViewer } from "@/components/content-viewer";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const content = await db.content.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      type: true,
      body: true,
      videoUrl: true,
    },
  });

  if (!content) return notFound();

  await db.content.update({
    where: { id: content.id },
    data: { viewCount: { increment: 1 } },
  });

  return <ContentViewer content={content} />;
}
