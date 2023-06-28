import { useEffect, useState } from 'react';

export enum THEME {
  dark,
  light,
}

function getCurrentTheme(): THEME {
  if (document.body.classList.contains('light')) {
    return THEME.light;
  }
  return THEME.dark;
}

export function usePreferTheme(): THEME {
  const [theme, setTheme] = useState(() => getCurrentTheme());

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setTheme(getCurrentTheme());
        }
      }
    });
    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}
