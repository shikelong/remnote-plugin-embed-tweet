export function extractTwitterId(twitterUrl: string): string | undefined {
  twitterUrl = twitterUrl.trim();
  const pattern = /^(https?:\/\/)??twitter\.com\/(?:#!\/)?(\w+|_|\s)+\/status\/(\d+)$/;
  const match = twitterUrl.match(pattern);
  return match?.at(-1);
}
