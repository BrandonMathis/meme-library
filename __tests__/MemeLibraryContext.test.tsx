import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import { MemeLibraryProvider, useMemeLibrary } from '@/context/MemeLibrary';
import {
  getAllMemes,
  insertMeme,
  removeMeme,
  updateMemeFavorite,
  updateMemeTags,
  destroyAll as destroyAllFromDb,
  exportData as exportDataFromDb,
  copyImageToLocal,
  deleteLocalImage,
} from '@/lib/meme-storage';

const mockedGetAllMemes = getAllMemes as jest.Mock;
const mockedInsertMeme = insertMeme as jest.Mock;
const mockedRemoveMeme = removeMeme as jest.Mock;
const mockedUpdateMemeFavorite = updateMemeFavorite as jest.Mock;
const mockedUpdateMemeTags = updateMemeTags as jest.Mock;
const mockedDestroyAll = destroyAllFromDb as jest.Mock;
const mockedExportData = exportDataFromDb as jest.Mock;
const mockedCopyImageToLocal = copyImageToLocal as jest.Mock;
const mockedDeleteLocalImage = deleteLocalImage as jest.Mock;

function TestConsumer() {
  const {
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
  } = useMemeLibrary();

  return (
    <>
      <Text testID="loading">{isLoading ? 'true' : 'false'}</Text>
      <Text testID="meme-count">{memes.length}</Text>
      <Text testID="memes">{JSON.stringify(memes)}</Text>
      <Text testID="last-added">{lastAddedId ?? 'null'}</Text>
      <Pressable testID="add-meme" onPress={() => addMeme('file://photo.jpg', ['funny', 'cat'])} />
      <Pressable testID="delete-meme" onPress={() => memes[0] && deleteMeme(memes[0].id)} />
      <Pressable
        testID="edit-tags"
        onPress={() => memes[0] && editTags(memes[0].id, ['updated'])}
      />
      <Pressable testID="toggle-fav" onPress={() => memes[0] && toggleFavorite(memes[0].id)} />
      <Pressable testID="destroy-all" onPress={() => destroyAll()} />
      <Pressable testID="export" onPress={() => exportData()} />
      <Pressable testID="clear-last" onPress={() => clearLastAdded()} />
    </>
  );
}

function renderWithProvider() {
  return render(
    <MemeLibraryProvider>
      <TestConsumer />
    </MemeLibraryProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetAllMemes.mockResolvedValue([]);
});

describe('MemeLibraryContext', () => {
  it('starts in loading state and loads memes on mount', async () => {
    const existingMemes = [
      { id: '1', uri: '/local/1.jpg', tags: ['funny'], createdAt: 1000, isFavorite: false },
      { id: '2', uri: '/local/2.jpg', tags: ['cat'], createdAt: 2000, isFavorite: true },
    ];
    mockedGetAllMemes.mockResolvedValue(existingMemes);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('meme-count').props.children).toBe(2);
    expect(getAllMemes).toHaveBeenCalledTimes(1);
  });

  it('adds a meme and updates state', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-meme'));
    });

    expect(mockedCopyImageToLocal).toHaveBeenCalledWith('file://photo.jpg', expect.any(String));
    expect(mockedInsertMeme).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: expect.stringContaining('/local/'),
        tags: ['funny', 'cat'],
        isFavorite: false,
      }),
    );
    expect(getByTestId('meme-count').props.children).toBe(1);
    expect(getByTestId('last-added').props.children).not.toBe('null');
  });

  it('deletes a meme and cleans up local image', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['test'], createdAt: 1000, isFavorite: false },
    ]);
    mockedRemoveMeme.mockResolvedValue('/local/1.jpg');

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('delete-meme'));
    });

    expect(mockedRemoveMeme).toHaveBeenCalledWith('1');
    expect(mockedDeleteLocalImage).toHaveBeenCalledWith('/local/1.jpg');
    expect(getByTestId('meme-count').props.children).toBe(0);
  });

  it('skips image cleanup when removeMeme returns null', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['test'], createdAt: 1000, isFavorite: false },
    ]);
    mockedRemoveMeme.mockResolvedValue(null);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('delete-meme'));
    });

    expect(mockedDeleteLocalImage).not.toHaveBeenCalled();
    expect(getByTestId('meme-count').props.children).toBe(0);
  });

  it('edits tags on a meme', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['old'], createdAt: 1000, isFavorite: false },
    ]);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('edit-tags'));
    });

    expect(mockedUpdateMemeTags).toHaveBeenCalledWith('1', ['updated']);
    const memes = JSON.parse(getByTestId('memes').props.children);
    expect(memes[0].tags).toEqual(['updated']);
  });

  it('toggles favorite on a meme', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['test'], createdAt: 1000, isFavorite: false },
    ]);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle-fav'));
    });

    expect(mockedUpdateMemeFavorite).toHaveBeenCalledWith('1', true);
    const memes = JSON.parse(getByTestId('memes').props.children);
    expect(memes[0].isFavorite).toBe(true);
  });

  it('destroys all memes', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['test'], createdAt: 1000, isFavorite: false },
    ]);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('destroy-all'));
    });

    expect(mockedDestroyAll).toHaveBeenCalled();
    expect(getByTestId('meme-count').props.children).toBe(0);
  });

  it('exports data', async () => {
    mockedExportData.mockResolvedValue('[{"id":"1"}]');

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('export'));
    });

    expect(mockedExportData).toHaveBeenCalled();
  });

  it('clears lastAddedId', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    // Add a meme to set lastAddedId
    await act(async () => {
      fireEvent.press(getByTestId('add-meme'));
    });
    expect(getByTestId('last-added').props.children).not.toBe('null');

    // Clear it
    await act(async () => {
      fireEvent.press(getByTestId('clear-last'));
    });
    expect(getByTestId('last-added').props.children).toBe('null');
  });

  it('prepends new memes to the list', async () => {
    mockedGetAllMemes.mockResolvedValue([
      { id: '1', uri: '/local/1.jpg', tags: ['first'], createdAt: 1000, isFavorite: false },
    ]);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('meme-count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-meme'));
    });

    const memes = JSON.parse(getByTestId('memes').props.children);
    expect(memes.length).toBe(2);
    // New meme should be first
    expect(memes[0].tags).toEqual(['funny', 'cat']);
    expect(memes[1].tags).toEqual(['first']);
  });
});
