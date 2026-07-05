// Domain models for the Sociality API.
//
// These mirror the live API responses, but normalized so the rest of the app
// never has to deal with the backend's quirks — inconsistent list keys
// (items/posts/users/comments) and the stats-vs-counts naming (see normalize.ts).

export type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type UserChip = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe?: boolean;
  isMe?: boolean;
  followsMe?: boolean;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  /** Only present on GET /api/me/likes. */
  likedAt?: string;
};

/** Stripped shape returned by GET /api/me/saved — no author or counts. */
export type SavedPost = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
  /** Only present on the create-comment response. */
  isMine?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

export type PageParams = {
  page?: number;
  limit?: number;
};

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

export type MyProfile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt?: string;
  stats: ProfileStats;
};

export type UpdatedProfile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  updatedAt?: string;
};

export type PublicProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: ProfileStats;
  isFollowing: boolean;
  isMe: boolean;
};

export type LikeResult = { liked: boolean; likeCount: number };
export type SaveResult = { saved: boolean };
export type FollowResult = { following: boolean };
export type DeleteResult = { deleted: boolean };
