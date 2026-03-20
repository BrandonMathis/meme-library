import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type MemeEntry = {
  id: string;
  uri: string;
  tags: string[];
  createdAt: number;
  isFavorite: boolean;
};

type MemeLibraryContextType = {
  memes: MemeEntry[];
  addMeme: (uri: string, tags: string[]) => void;
  deleteMeme: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const MemeLibraryContext = createContext<MemeLibraryContextType>({
  memes: [],
  addMeme: () => {},
  deleteMeme: () => {},
  toggleFavorite: () => {},
});

export function MemeLibraryProvider({ children }: { children: ReactNode }) {
  const [memes, setMemes] = useState<MemeEntry[]>([]);

  const addMeme = useCallback((uri: string, tags: string[]) => {
    setMemes((prev) => [
      {
        id: Date.now().toString(),
        uri,
        tags,
        createdAt: Date.now(),
        isFavorite: false,
      },
      ...prev,
    ]);
  }, []);

  const deleteMeme = useCallback((id: string) => {
    setMemes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setMemes((prev) => prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)));
  }, []);

  return (
    <MemeLibraryContext.Provider value={{ memes, addMeme, deleteMeme, toggleFavorite }}>
      {children}
    </MemeLibraryContext.Provider>
  );
}

export function useMemeLibrary() {
  return useContext(MemeLibraryContext);
}
