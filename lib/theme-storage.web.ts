import type { ThemeId } from './themes';

const STORAGE_KEY = 'meme-library-theme';

export async function loadThemeId(): Promise<ThemeId | null> {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return (value as ThemeId) ?? null;
  } catch {
    return null;
  }
}

export async function saveThemeId(themeId: ThemeId): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // Silently ignore storage errors
  }
}
