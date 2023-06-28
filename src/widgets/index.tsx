import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { EMBED_TWEET_POWERUP } from '../constant';

async function onActivate(plugin: ReactRNPlugin) {
  // A command that inserts text into the editor if focused.
  await plugin.app.registerCommand({
    id: 'tweet',
    name: 'Embed Tweet',
    action: async () => {
      const rem = await plugin.focus.getFocusedRem();
      await rem?.addPowerup(EMBED_TWEET_POWERUP);
    },
  });

  await plugin.app.registerPowerup('EmbedTweet', EMBED_TWEET_POWERUP, 'Embed Tweet into RemNote', {
    slots: [{ code: 'PostUrl', name: 'PostUrl' }],
  });

  await plugin.app.registerWidget('embed_tweet', WidgetLocation.UnderRemEditor, {
    dimensions: { height: 'auto', width: '100%' },
    powerupFilter: EMBED_TWEET_POWERUP,
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
