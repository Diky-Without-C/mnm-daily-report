export function formatRelativeTime(date: Date | number) {
  const timestamp = date instanceof Date ? date.getTime() : date;
  const diff = Date.now() - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return "just now";
  if (minutes === 1) return "a minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "an hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return "a week ago";
  if (weeks < 4) return `${weeks} weeks ago`;

  return new Date(timestamp).toLocaleDateString();
}
