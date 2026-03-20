import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  copyImageToLocal,
  deleteLocalImage,
  destroyAll as destroyAllFromDb,
  exportData as exportDataFromDb,
  getAllMemes,
  insertMeme,
  removeMeme as removeMemeFromDb,
  updateMemeFavorite,
  updateMemeTags,
} from '@/lib/meme-storage';

export type MemeEntry = {
  id: string;
  uri: string;
  tags: string[];
  createdAt: number;
  isFavorite: boolean;
};

type MemeLibraryContextType = {
  memes: MemeEntry[];
  isLoading: boolean;
  addMeme: (uri: string, tags: string[]) => Promise<void>;
  deleteMeme: (id: string) => Promise<void>;
  editTags: (id: string, tags: string[]) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  destroyAll: () => Promise<void>;
  exportData: () => Promise<string>;
  lastAddedId: string | null;
  clearLastAdded: () => void;
};

const MemeLibraryContext = createContext<MemeLibraryContextType>({
  memes: [],
  isLoading: true,
  addMeme: async () => {},
  deleteMeme: async () => {},
  editTags: async () => {},
  toggleFavorite: async () => {},
  destroyAll: async () => {},
  exportData: async () => '',
  lastAddedId: null,
  clearLastAdded: () => {},
});

export function MemeLibraryProvider({ children }: { children: ReactNode }) {
  const [memes, setMemes] = useState<MemeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    getAllMemes()
      .then(setMemes)
      .finally(() => setIsLoading(false));
  }, []);

  const clearLastAdded = useCallback(() => {
    setLastAddedId(null);
  }, []);

  const addMeme = useCallback(async (uri: string, tags: string[]) => {
    const id = Date.now().toString();
    const localUri = await copyImageToLocal(uri, id);
    const createdAt = Date.now();
    const meme: MemeEntry = { id, uri: localUri, tags, createdAt, isFavorite: false };

    await insertMeme(meme);
    setMemes((prev) => [meme, ...prev]);
    setLastAddedId(id);
  }, []);

  const deleteMeme = useCallback(async (id: string) => {
    const uri = await removeMemeFromDb(id);
    if (uri) {
      await deleteLocalImage(uri);
    }
    setMemes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const editTags = useCallback(async (id: string, tags: string[]) => {
    await updateMemeTags(id, tags);
    setMemes((prev) => prev.map((m) => (m.id === id ? { ...m, tags } : m)));
  }, []);

  const toggleFavorite = useCallback(
    async (id: string) => {
      setMemes((prev) => prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)));
      const meme = memes.find((m) => m.id === id);
      await updateMemeFavorite(id, meme ? !meme.isFavorite : true);
    },
    [memes],
  );

  const destroyAll = useCallback(async () => {
    await destroyAllFromDb();
    setMemes([]);
  }, []);

  const exportData = useCallback(async () => {
    return exportDataFromDb();
  }, []);

  return (
    <MemeLibraryContext.Provider
      value={{
        memes,
        isLoading,
        addMeme,
        deleteMeme,
        editTags,
        toggleFavorite,
        destroyAll,
        exportData,
        lastAddedId,
        clearLastAdded,
      }}
    >
      {children}
    </MemeLibraryContext.Provider>
  );
}

export function useMemeLibrary() {
  return useContext(MemeLibraryContext);
}
