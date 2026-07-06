import type { Metadata } from "next";
import { SearchPage } from "@/features/search/search-page";

export const metadata: Metadata = {
  title: "Search",
};

export default function Search() {
  return <SearchPage />;
}
