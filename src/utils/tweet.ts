export function extractTweetId(tweetUrl: string): string | undefined {
  tweetUrl = tweetUrl.trim();
  const pattern = /^(https?:\/\/)??twitter\.com\/(?:#!\/)?(\w+|_|\s)+\/status\/(\d+)$/;
  const match = tweetUrl.match(pattern);
  return match?.at(-1);
}
