import { extractTweetId } from '../tweet';

describe('[extractTweetId]', () => {
  it.each([
    ['https://twitter.com/elonmusk/status/1673402963757244420', '1673402963757244420'],
    ['twitter.com/elonmusk/status/1673402963757244420', '1673402963757244420'],
    [' https://twitter.com/elonmusk/status/1673402963757244420 ', '1673402963757244420'],
    ['https://twitter.com/elonmusk/status/1673402963757244420?test=12213', '1673402963757244420'],
    [
      'precontentxxxx https://twitter.com/elonmusk/status/1673402963757244420?test=12213 postcontentxxxxx',
      '1673402963757244420',
    ],
    [
      'precontentxxxx https://twitter.com/elonmusk/status/1673402963757244420?test=12213 xxxxasdasd https://twitter.com/elonmusk/status/16734029637572442120?test=12213 postcontentxxxxx',
      '1673402963757244420',
    ],
    [
      `precontentxxxx 
      https://twitter.com/elonmusk/status/1673402963757244420?test=12213 xxxx
      asdasd https://twitter.com/elonmusk/status/16734029637572442120?test=12213 postcontentxxxxx`,
      '1673402963757244420',
    ],
    //support x.com
    ['https://x.com/elonmusk/status/1673402963757244420', '1673402963757244420'],
    ['x.com/elonmusk/status/1673402963757244420', '1673402963757244420'],
    [' https://x.com/elonmusk/status/1673402963757244420 ', '1673402963757244420'],
    ['https://x.com/elonmusk/status/1673402963757244420?test=12213', '1673402963757244420'],
    [
      'precontentxxxx https://x.com/elonmusk/status/1673402963757244420?test=12213 postcontentxxxxx',
      '1673402963757244420',
    ],
    [
      'precontentxxxx https://x.com/elonmusk/status/1673402963757244420?test=12213 xxxxasdasd https://x.com/elonmusk/status/16734029637572442120?test=12213 postcontentxxxxx',
      '1673402963757244420',
    ],
    [
      `precontentxxxx 
      https://x.com/elonmusk/status/1673402963757244420?test=12213 xxxx
      asdasd https://x.com/elonmusk/status/16734029637572442120?test=12213 postcontentxxxxx`,
      '1673402963757244420',
    ],
  ])('should get tweetId from valid string: %s', (input, expected) => {
    const tweetId = extractTweetId(input);
    expect(tweetId).toEqual(expected);
  });

  it.each([
    'https://google.com',
    'https://twitter.com/elonmusk/status/',
    'https://twitter.com/elonmusk/status/invalidId',
    'invalid string',
    undefined,
    null,
    '',
    '12324',
  ])('should return null for invalid string: %s', (input) => {
    const tweetId = extractTweetId(input as string);
    expect(tweetId).toBeNull();
  });
});
