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

const EMBED_TWITTER_WIDGET = 'embed_twitter_widget';
const EMBED_TWITTER_WIDGET_RENDERER = 'embed_twitter_widget_renderer';

export const EmbedTwitterWidget = () => {
  const plugin = usePlugin();
  const [id] = useState(nanoid());

  const widgetRef = useRef<HTMLDivElement | null>(null);

  const [twitterId, setTwitterId] = useState<string | null>();

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
      {twitterId ? (
        <Tweet tweetId={twitterId} options={{ theme: 'dark' }} />
      ) : (
        `no valid twitter Id: ${twitterId}`
      )}
    </div>
  );
};

renderWidget(EmbedTwitterWidget);
