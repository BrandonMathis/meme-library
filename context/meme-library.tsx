import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type MemeEntry = {
  id: string;
  uri: string;
  tags: string[];
  createdAt: number;
};

type MemeLibraryContextType = {
  memes: MemeEntry[];
  addMeme: (uri: string, tags: string[]) => void;
};

const MemeLibraryContext = createContext<MemeLibraryContextType>({
  memes: [],
  addMeme: () => {},
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
      },
      ...prev,
    ]);
  }, []);

  return (
    <MemeLibraryContext.Provider value={{ memes, addMeme }}>{children}</MemeLibraryContext.Provider>
  );
}

export function useMemeLibrary() {
  return useContext(MemeLibraryContext);
}
