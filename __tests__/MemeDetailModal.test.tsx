import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Platform, Alert } from 'react-native';

const mockDeleteMeme = jest.fn();
const mockToggleFavorite = jest.fn();
const mockEditTags = jest.fn();
const mockDismiss = jest.fn();

let mockMemes: Array<Record<string, unknown>> = [];

jest.mock('@/context/MemeLibrary', () => ({
  useMemeLibrary: () => ({
    deleteMeme: mockDeleteMeme,
    toggleFavorite: mockToggleFavorite,
    editTags: mockEditTags,
    get memes() {
      return mockMemes;
    },
    isLoading: false,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    dismiss: mockDismiss,
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: '1' }),
  Stack: {
    Screen: ({ options }: { options: Record<string, unknown> }) => {
      const { View } = require('react-native');
      return <View testID="stack-screen" />;
    },
  },
}));

import MemeDetailModal from '@/app/MemeDetailModal';
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
  mockMemes = [makeMeme()];
});

describe('MemeDetailModal', () => {
  it('renders when a meme is provided', () => {
    const { getByText } = render(<MemeDetailModal />);

    expect(getByText('Share')).toBeTruthy();
    expect(getByText('Favorite')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('shows Unfavorite text when meme is favorited', () => {
    mockMemes = [makeMeme({ isFavorite: true })];

    const { getByText } = render(<MemeDetailModal />);
    expect(getByText('Unfavorite')).toBeTruthy();
  });

  it('shows Favorite text when meme is not favorited', () => {
    const { getByText } = render(<MemeDetailModal />);
    expect(getByText('Favorite')).toBeTruthy();
  });

  it('calls toggleFavorite when favorite button is pressed', async () => {
    const { getByText } = render(<MemeDetailModal />);

    await act(async () => {
      fireEvent.press(getByText('Favorite'));
    });

    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });

  it('calls deleteMeme and dismisses on web platform', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web';

    const { getByText } = render(<MemeDetailModal />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).toHaveBeenCalledWith('1');
    expect(mockDismiss).toHaveBeenCalled();

    Platform.OS = originalPlatform;
  });

  it('shows Alert confirmation on native delete', async () => {
    Platform.OS = 'ios';
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(<MemeDetailModal />);

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

    // Mock Alert.alert to immediately call the destructive action
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const deleteBtn = buttons?.find((b) => b.text === 'Delete');
      if (deleteBtn?.onPress) deleteBtn.onPress();
    });

    const { getByText } = render(<MemeDetailModal />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).toHaveBeenCalledWith('1');
    expect(mockDismiss).toHaveBeenCalled();

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

    const { getByText } = render(<MemeDetailModal />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    expect(mockDeleteMeme).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    Platform.OS = 'android';
  });
});
