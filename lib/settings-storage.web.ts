const STORAGE_KEY = 'meme-library-deleteAfterSave';

export async function loadDeleteAfterSave(): Promise<boolean> {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function saveDeleteAfterSave(enabled: boolean): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Silently ignore storage errors
  }
}
