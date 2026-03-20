import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { useMemeLibrary } from '@/context/MemeLibrary';

jest.mock('@/context/MemeLibrary', () => ({
  useMemeLibrary: jest.fn(),
  MemeLibraryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    dismiss: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockedUseMemeLibrary = useMemeLibrary as jest.Mock;

// Import after mocks
import MemeLibraryScreen from '@/app/(tabs)/index';

const makeMeme = (overrides: Record<string, unknown> = {}) => ({
  id: '1',
  uri: 'file://meme1.jpg',
  tags: ['funny'],
  createdAt: 1000,
  isFavorite: false,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseMemeLibrary.mockReturnValue({
    memes: [],
    isLoading: false,
    addMeme: jest.fn(),
    deleteMeme: jest.fn(),
    editTags: jest.fn(),
    toggleFavorite: jest.fn(),
    destroyAll: jest.fn(),
    exportData: jest.fn(),
    lastAddedId: null,
    clearLastAdded: jest.fn(),
  });
});

describe('MemeLibraryScreen', () => {
  it('renders the screen title', () => {
    const { getByText } = render(<MemeLibraryScreen />);
    expect(getByText('Meme Library')).toBeTruthy();
  });

  it('shows empty state when there are no memes', () => {
    const { getByText } = render(<MemeLibraryScreen />);
    expect(getByText('Your meme collection will appear here.')).toBeTruthy();
  });

  it('shows search empty state when search has no results', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme()],
      isLoading: false,
    });

    const { getByPlaceholderText, getByText } = render(<MemeLibraryScreen />);

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'nonexistent');

    expect(getByText('No memes match your search.')).toBeTruthy();
  });

  it('renders memes in a grid with tags', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny', 'cat'] }),
        makeMeme({ id: '2', tags: ['dog'], uri: 'file://meme2.jpg' }),
      ],
      isLoading: false,
    });

    const { getByText } = render(<MemeLibraryScreen />);

    expect(getByText('funny')).toBeTruthy();
    expect(getByText('cat')).toBeTruthy();
    expect(getByText('dog')).toBeTruthy();
  });

  it('filters memes by search query matching tags', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny', 'cat'] }),
        makeMeme({ id: '2', tags: ['dog'], uri: 'file://meme2.jpg' }),
      ],
      isLoading: false,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(<MemeLibraryScreen />);

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'cat');

    expect(getByText('cat')).toBeTruthy();
    expect(queryByText('dog')).toBeNull();
  });

  it('search is case insensitive', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme({ id: '1', tags: ['Funny'] })],
      isLoading: false,
    });

    const { getByPlaceholderText, getByText } = render(<MemeLibraryScreen />);

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'FUNNY');

    expect(getByText('Funny')).toBeTruthy();
  });

  it('search matches partial tags', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme({ id: '1', tags: ['funny'] })],
      isLoading: false,
    });

    const { getByPlaceholderText, getByText } = render(<MemeLibraryScreen />);

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'fun');

    expect(getByText('funny')).toBeTruthy();
  });

  it('shows all memes when search is cleared', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny'] }),
        makeMeme({ id: '2', tags: ['dog'], uri: 'file://meme2.jpg' }),
      ],
      isLoading: false,
    });

    const { getByPlaceholderText, getByText } = render(<MemeLibraryScreen />);

    // Search to filter
    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'funny');
    // Clear search
    fireEvent.changeText(getByPlaceholderText('Search by tag...'), '');

    expect(getByText('funny')).toBeTruthy();
    expect(getByText('dog')).toBeTruthy();
  });

  it('does not show tags section for memes with no tags', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme({ id: '1', tags: [] })],
      isLoading: false,
    });

    const { queryByText } = render(<MemeLibraryScreen />);

    // The meme should render but no tag badges
    expect(queryByText('funny')).toBeNull();
  });

  it('renders search input', () => {
    const { getByPlaceholderText } = render(<MemeLibraryScreen />);
    expect(getByPlaceholderText('Search by tag...')).toBeTruthy();
  });
});
