import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { EMBED_TWITTER_POWERUP } from '../constant';

async function onActivate(plugin: ReactRNPlugin) {
  // A command that inserts text into the editor if focused.
  await plugin.app.registerCommand({
    id: 'twitter',
    name: 'Embed Twitter',
    action: async () => {
      const rem = await plugin.focus.getFocusedRem();
      await rem?.addPowerup(EMBED_TWITTER_POWERUP);
    },
  });

  await plugin.app.registerPowerup(
    'EmbedTwitter',
    EMBED_TWITTER_POWERUP,
    'Embed Twitter Post into RemNote',
    {
      slots: [{ code: 'PostUrl', name: 'PostUrl' }],
    }
  );

  await plugin.app.registerWidget('embed_twitter', WidgetLocation.UnderRemEditor, {
    dimensions: { height: 'auto', width: '100%' },
    powerupFilter: EMBED_TWITTER_POWERUP,
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
