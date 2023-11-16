export function extractTweetId(tweetUrl: string): string | null {
  if (!tweetUrl) {
    return null;
  }
  tweetUrl = tweetUrl.trim();
  const pattern = /(https?:\/\/)??(?:twitter|x)\.com\/(?:#!\/)?(\w+|_|\s)+\/status\/(\d+)/i;
  const match = tweetUrl.match(pattern);
  return match?.at(-1) ?? null;
}
