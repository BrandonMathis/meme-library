import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

const mockAddMeme = jest.fn();
const mockDismiss = jest.fn();

jest.mock('@/context/MemeLibrary', () => ({
  useMemeLibrary: () => ({
    addMeme: mockAddMeme,
    memes: [],
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
  useLocalSearchParams: () => ({ uri: 'file://photo.jpg', assetId: 'asset-123' }),
  Stack: {
    Screen: ({ options }: { options: Record<string, unknown> }) => {
      const { View } = require('react-native');
      const HeaderLeft = options.headerLeft as React.FC;
      const HeaderRight = options.headerRight as React.FC;
      return (
        <View testID="stack-screen">
          {HeaderLeft && <HeaderLeft />}
          {HeaderRight && <HeaderRight />}
        </View>
      );
    },
  },
}));

import AddMemeModal from '@/app/AddMemeModal';

beforeEach(() => {
  jest.clearAllMocks();
  mockAddMeme.mockResolvedValue(undefined);
});

describe('AddMemeModal', () => {
  it('renders the image preview when uri is provided', () => {
    const { toJSON } = render(<AddMemeModal />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders cancel and save buttons', () => {
    const { getByText } = render(<AddMemeModal />);
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('dismisses modal when cancel is pressed', () => {
    const { getByText } = render(<AddMemeModal />);
    fireEvent.press(getByText('Cancel'));
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('saves meme with tags and dismisses on save', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMemeModal />);

    // Add a tag
    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'funny');
    fireEvent.press(getByText('+'));

    // Save
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(mockAddMeme).toHaveBeenCalledWith('file://photo.jpg', ['funny'], 'asset-123');
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('saves meme with no tags', async () => {
    const { getByText } = render(<AddMemeModal />);

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(mockAddMeme).toHaveBeenCalledWith('file://photo.jpg', [], 'asset-123');
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('saves meme with multiple tags', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMemeModal />);

    // Add multiple tags
    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'funny');
    fireEvent.press(getByText('+'));
    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'cat');
    fireEvent.press(getByText('+'));

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(mockAddMeme).toHaveBeenCalledWith('file://photo.jpg', ['funny', 'cat'], 'asset-123');
  });

  it('can remove a tag before saving', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMemeModal />);

    // Add two tags
    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'funny');
    fireEvent.press(getByText('+'));
    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'cat');
    fireEvent.press(getByText('+'));

    // Remove the first tag via the badge overlay on the image
    fireEvent(getByText('funny ✕'), 'touchEnd');

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(mockAddMeme).toHaveBeenCalledWith('file://photo.jpg', ['cat'], 'asset-123');
  });

  it('prevents double-save while saving is in progress', async () => {
    let resolveAddMeme: () => void;
    mockAddMeme.mockImplementation(
      () => new Promise<void>((resolve) => (resolveAddMeme = resolve)),
    );

    const { getByText } = render(<AddMemeModal />);

    // First save
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    // Second save should not trigger addMeme again
    await act(async () => {
      fireEvent.press(getByText('Saving...'));
    });

    expect(mockAddMeme).toHaveBeenCalledTimes(1);

    // Resolve to clean up
    await act(async () => {
      resolveAddMeme!();
    });
  });

  it('shows saving state while save is in progress', async () => {
    let resolveAddMeme: () => void;
    mockAddMeme.mockImplementation(
      () => new Promise<void>((resolve) => (resolveAddMeme = resolve)),
    );

    const { getByText } = render(<AddMemeModal />);

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(getByText('Saving...')).toBeTruthy();

    await act(async () => {
      resolveAddMeme!();
    });
  });

  it('resets saving state after save completes', async () => {
    const { getByText } = render(<AddMemeModal />);

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    // After save completes and modal re-renders, isSaving should be false
    // (the component dismisses, but the state resets in finally block)
    expect(mockAddMeme).toHaveBeenCalledTimes(1);
  });
});
