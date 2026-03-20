import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Platform, Alert } from 'react-native';

const mockDeleteMeme = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock('@/context/MemeLibrary', () => ({
  useMemeLibrary: () => ({
    deleteMeme: mockDeleteMeme,
    toggleFavorite: mockToggleFavorite,
    memes: [],
    isLoading: false,
  }),
}));

import MemeDetailsModal from '@/components/MemeDetailModal';
import type { MemeEntry } from '@/context/MemeLibrary';

const makeMeme = (overrides: Partial<MemeEntry> = {}): MemeEntry => ({
  id: '1',
  uri: 'file://meme1.jpg',
  tags: ['funny'],
  createdAt: 1000,
  isFavorite: false,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockDeleteMeme.mockResolvedValue(undefined);
  mockToggleFavorite.mockResolvedValue(undefined);
});

describe('MemeDetailsModal', () => {
  it('returns null when meme is null', () => {
    const { toJSON } = render(<MemeDetailsModal meme={null} onClose={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  it('renders when a meme is provided', () => {
    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    expect(getByText('Share')).toBeTruthy();
    expect(getByText('Favorite')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('shows Unfavorite text when meme is favorited', () => {
    const meme = makeMeme({ isFavorite: true });
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    expect(getByText('Unfavorite')).toBeTruthy();
  });

  it('shows Favorite text when meme is not favorited', () => {
    const meme = makeMeme({ isFavorite: false });
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    expect(getByText('Favorite')).toBeTruthy();
  });

  it('calls toggleFavorite when favorite button is pressed', async () => {
    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    await act(async () => {
      fireEvent.press(getByText('Favorite'));
    });

    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });

  it('calls deleteMeme and onClose on web platform', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web';

    const onClose = jest.fn();
    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={onClose} />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).toHaveBeenCalledWith('1');
    expect(onClose).toHaveBeenCalled();

    Platform.OS = originalPlatform;
  });

  it('shows Alert confirmation on native delete', async () => {
    Platform.OS = 'ios';
    const alertSpy = jest.spyOn(Alert, 'alert');

    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Delete Meme',
      'Are you sure you want to delete this meme?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Delete', style: 'destructive' }),
      ]),
    );

    alertSpy.mockRestore();
    Platform.OS = 'android'; // restore
  });

  it('deletes meme when Alert delete is confirmed', async () => {
    Platform.OS = 'ios';
    const onClose = jest.fn();

    // Mock Alert.alert to immediately call the destructive action
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const deleteBtn = buttons?.find((b) => b.text === 'Delete');
      if (deleteBtn?.onPress) deleteBtn.onPress();
    });

    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={onClose} />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).toHaveBeenCalledWith('1');
    expect(onClose).toHaveBeenCalled();

    alertSpy.mockRestore();
    Platform.OS = 'android';
  });

  it('does not delete when Alert cancel is pressed', async () => {
    Platform.OS = 'ios';

    // Mock Alert.alert to press cancel
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const cancelBtn = buttons?.find((b) => b.text === 'Cancel');
      if (cancelBtn?.onPress) cancelBtn.onPress();
    });

    const meme = makeMeme();
    const { getByText } = render(<MemeDetailsModal meme={meme} onClose={jest.fn()} />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    Platform.OS = 'android';
  });
});
