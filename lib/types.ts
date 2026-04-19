export type FeedItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: "VIDEO" | "ARTICLE";
  thumbnail: string | null;
  likesCount: number;
  bookmarksCount: number;
  viewCount: number;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string | Date;
  trendingScore: number | null;
};
