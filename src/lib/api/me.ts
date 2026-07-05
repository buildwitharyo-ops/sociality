import { apiFetch } from "./client";
import { normalizeList, normalizeStats } from "./normalize";
import type {
  MyProfile,
  Paginated,
  PageParams,
  Post,
  SavedPost,
  UpdatedProfile,
  UserChip,
} from "./types";

export type UpdateMeInput = {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
};

export async function getMe(): Promise<MyProfile> {
  const data = await apiFetch<{ profile: Omit<MyProfile, "stats">; stats: unknown }>("/api/me");
  return { ...data.profile, stats: normalizeStats(data.stats) };
}

/** Pass FormData (with an `avatar` file) to change the photo, or a plain object otherwise. */
export function updateMe(input: UpdateMeInput | FormData): Promise<UpdatedProfile> {
  return apiFetch<UpdatedProfile>("/api/me", { method: "PATCH", body: input });
}

export async function getMyPosts(params: PageParams = {}): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch("/api/me/posts", { query: params }));
}

export async function getMyLikes(params: PageParams = {}): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch("/api/me/likes", { query: params }));
}

export async function getMySaved(params: PageParams = {}): Promise<Paginated<SavedPost>> {
  return normalizeList<SavedPost>(await apiFetch("/api/me/saved", { query: params }));
}

export async function getMyFollowers(params: PageParams = {}): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(await apiFetch("/api/me/followers", { query: params }));
}

export async function getMyFollowing(params: PageParams = {}): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(await apiFetch("/api/me/following", { query: params }));
}
