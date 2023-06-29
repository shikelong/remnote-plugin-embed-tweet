import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { EMBED_TWEET_POWERUP, SETTING_IDs } from '../constant';

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

  await plugin.settings.registerBooleanSetting({
    id: SETTING_IDs.compactCard,
    title: 'Compact Card',
    defaultValue: false,
    description: 'In compact mode, links are not expanded to photo, video or link preview.nm',
  });

  await plugin.settings.registerDropdownSetting({
    id: SETTING_IDs.theme,
    title: 'Theme',
    options: [
      { key: '1', value: 'auto', label: 'Auto' },
      { key: '2', value: 'light', label: 'Light' },
      { key: '3', value: 'dark', label: 'Dark' },
    ],
    defaultValue: 'auto',
  });

  await plugin.settings.registerDropdownSetting({
    id: SETTING_IDs.align,
    title: 'Align',
    options: [
      { key: '1', value: 'left', label: 'Left' },
      { key: '2', value: 'middle', label: 'Middle' },
      { key: '3', value: 'right', label: 'Right' },
    ],
    defaultValue: 'left',
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
