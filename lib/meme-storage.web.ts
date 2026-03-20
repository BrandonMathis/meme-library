import type { MemeEntry } from '@/context/meme-library';

const DB_NAME = 'meme-library';
const DB_VERSION = 1;
const MEMES_STORE = 'memes';
const IMAGES_STORE = 'images';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEMES_STORE)) {
        db.createObjectStore(MEMES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function copyImageToLocal(sourceUri: string, id: string): Promise<string> {
  try {
    const response = await fetch(sourceUri);
    const blob = await response.blob();
    const db = await openDb();
    const tx = db.transaction(IMAGES_STORE, 'readwrite');
    await idbRequest(tx.objectStore(IMAGES_STORE).put(blob, id));
    return `idb://${id}`;
  } catch {
    // Fallback to the original URI if fetch fails
    return sourceUri;
  }
}

export async function deleteLocalImage(uri: string): Promise<void> {
  const match = uri.match(/^idb:\/\/(.+)$/);
  if (!match) return;

  try {
    const db = await openDb();
    const tx = db.transaction(IMAGES_STORE, 'readwrite');
    await idbRequest(tx.objectStore(IMAGES_STORE).delete(match[1]));
  } catch {
    // Silently ignore deletion errors
  }
}

export async function getAllMemes(): Promise<MemeEntry[]> {
  const db = await openDb();
  const tx = db.transaction(MEMES_STORE, 'readonly');
  const rows = await idbRequest(tx.objectStore(MEMES_STORE).getAll() as IDBRequest<MemeEntry[]>);
  return rows.sort((a, b) => b.createdAt - a.createdAt);
}

export async function insertMeme(meme: MemeEntry): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(MEMES_STORE, 'readwrite');
  await idbRequest(tx.objectStore(MEMES_STORE).put(meme));
}

export async function removeMeme(id: string): Promise<string | null> {
  const db = await openDb();
  const tx = db.transaction(MEMES_STORE, 'readwrite');
  const store = tx.objectStore(MEMES_STORE);
  const existing = await idbRequest(store.get(id) as IDBRequest<MemeEntry | undefined>);
  const uri = existing?.uri ?? null;
  await idbRequest(store.delete(id));
  return uri;
}

export async function updateMemeTags(id: string, tags: string[]): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(MEMES_STORE, 'readwrite');
  const store = tx.objectStore(MEMES_STORE);
  const existing = await idbRequest(store.get(id) as IDBRequest<MemeEntry | undefined>);
  if (existing) {
    await idbRequest(store.put({ ...existing, tags }));
  }
}
