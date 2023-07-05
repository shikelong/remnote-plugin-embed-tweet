import {
  AppEvents,
  WidgetLocation,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useRunAsync,
} from '@remnote/plugin-sdk';
import { debounce } from 'debounce';
import { useEffect, useState } from 'react';
import { extractTweetId } from '../utils';

import { Tweet } from 'react-twitter-widgets';
import { useTweetOptions } from '../hooks/useTweetOptions';

export const EmbedTweetWidget = () => {
  const plugin = usePlugin();
  const [tweetId, setTweetId] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const tweetOptions = useTweetOptions();

  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );

  const getRemText = async (remId: string) => {
    const rem = await plugin.rem.findOne(remId);
    const text = await plugin.richText.toString(rem?.text || []);
    return text?.toString() || '';
  };

  const getTweetId = async () => {
    const remId = widgetContext?.remId;
    const text = remId && (await getRemText(remId));
    const tweetId = extractTweetId(text ?? '');
    setTweetId(tweetId);
  };

  useAPIEventListener(
    AppEvents.RemChanged,
    widgetContext?.remId,
    debounce(() => getTweetId(), 500)
  );

  useEffect(() => {
    if (widgetContext?.remId) {
      getTweetId();
    }
  }, [widgetContext?.remId]);

  return (
    <div>
      {loading && tweetId && <div>Loading...</div>}
      {tweetId ? (
        <Tweet
          tweetId={tweetId}
          options={tweetOptions}
          onLoad={() => {
            setLoading(false);
          }}
          renderError={(error) => {
            console.error('Tweet render error', error);
            setLoading(false);
            return 'Could not load tweet! ';
          }}
        />
      ) : (
        <p
          style={{
            color: 'red',
            border: '1px solid',
            padding: '0.5em 1em',
            borderRadius: 10,
            fontSize: 'smaller',
          }}
        >
          Can't get a valid Tweet id from tagged Rem, make sure the rem content is a valid tweet
          link like <a>https://twitter.com/elonmusk/status/1673976802103148544</a>
        </p>
      )}
    </div>
  );
};

renderWidget(EmbedTweetWidget);
