import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// "2 minutes ago", "3 days ago" — used on cards, detail, and comments.
export function fromNow(iso: string): string {
  return dayjs(iso).fromNow();
}
