import { useTracker } from '@remnote/plugin-sdk';
import { SETTING_IDs, THEME_SETTING } from '../constant';
import { usePreferTheme } from './usePreferTheme';

export type TweetOptions = {
  theme: 'light' | 'dark';
  cards: 'hidden' | null;
  align: 'center' | 'left' | 'right';
};

export function useTweetOptions(): TweetOptions {
  const preferRemNoteTheme = usePreferTheme();

  const align = useTracker(
    async (reactivePlugin) => await reactivePlugin.settings.getSetting(SETTING_IDs.align),
    []
  );

  const theme = useTracker<THEME_SETTING>(
    async (reactivePlugin) => await reactivePlugin.settings.getSetting(SETTING_IDs.theme),
    []
  );

  const compactCard = useTracker(
    async (reactivePlugin) => await reactivePlugin.settings.getSetting(SETTING_IDs.compactCard),
    []
  );

  return {
    theme: theme === 'auto' || theme === undefined ? preferRemNoteTheme : theme,
    cards: compactCard ? 'hidden' : null,
    align: align === 'center' ? 'center' : align === 'left' ? 'left' : 'right',
  };
}
