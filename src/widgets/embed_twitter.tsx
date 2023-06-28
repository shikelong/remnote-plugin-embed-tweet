import {
  AppEvents,
  WidgetLocation,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useRunAsync,
} from '@remnote/plugin-sdk';
import { debounce } from 'debounce';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { extractTwitterId } from '../utils';

import { Tweet } from 'react-twitter-widgets';
import { THEME, usePreferTheme } from '../hooks/usePreferTheme';

const EMBED_TWITTER_WIDGET = 'embed_twitter_widget';

export const EmbedTwitterWidget = () => {
  const plugin = usePlugin();
  const [id] = useState(nanoid());
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [twitterId, setTwitterId] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const theme = usePreferTheme();

  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );

  const getRemText = async (remId: string) => {
    const rem = await plugin.rem.findOne(remId);
    const text = await plugin.richText.toString(rem?.text || []);
    return text?.toString() || '';
  };

  const getTwitterId = async () => {
    const remId = widgetContext?.remId;
    const text = remId && (await getRemText(remId));
    const twitterId = extractTwitterId(text ?? '');
    setTwitterId(twitterId);
  };

  useAPIEventListener(
    AppEvents.RemChanged,
    widgetContext?.remId,
    debounce(() => getTwitterId(), 500)
  );

  useEffect(() => {
    if (widgetContext?.remId && widgetRef.current) {
      getTwitterId();
    }
  }, [widgetContext?.remId, widgetRef.current]);

  return (
    <div>
      <div ref={widgetRef} id={EMBED_TWITTER_WIDGET + id} />
      {loading && <div>Loading...</div>}
      {twitterId ? (
        <Tweet
          tweetId={twitterId}
          options={{ theme: theme === THEME.light ? 'light' : 'dark', cards: 'hidden' }}
          onLoad={() => {
            setLoading(false);
          }}
          renderError={(error) => {
            console.error('Tweet render error', error);
            return 'Could not load tweet! ';
          }}
        />
      ) : (
        `no valid twitter Id: ${twitterId}`
      )}
    </div>
  );
};

renderWidget(EmbedTwitterWidget);
