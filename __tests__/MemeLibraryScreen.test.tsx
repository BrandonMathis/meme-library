import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

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

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'funny');
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

    expect(queryByText('funny')).toBeNull();
  });

  it('renders search input', () => {
    const { getByPlaceholderText } = render(<MemeLibraryScreen />);
    expect(getByPlaceholderText('Search by tag...')).toBeTruthy();
  });

  // Filter menu button tests
  it('renders the filter button', () => {
    const { getByTestId } = render(<MemeLibraryScreen />);
    expect(getByTestId('filter-button')).toBeTruthy();
  });

  it('opens filter menu when filter button is pressed', () => {
    const { getByTestId, getByText } = render(<MemeLibraryScreen />);

    fireEvent.press(getByTestId('filter-button'));

    expect(getByText('All Memes')).toBeTruthy();
    expect(getByText('Favorites')).toBeTruthy();
  });

  it('closes filter menu when backdrop is pressed', () => {
    const { getByTestId, queryByTestId } = render(<MemeLibraryScreen />);

    fireEvent.press(getByTestId('filter-button'));
    expect(getByTestId('filter-option-all')).toBeTruthy();

    fireEvent.press(getByTestId('filter-backdrop'));
    expect(queryByTestId('filter-option-all')).toBeNull();
  });

  it('closes filter menu after selecting an option', () => {
    const { getByTestId, queryByTestId } = render(<MemeLibraryScreen />);

    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));

    // Menu should close after selection
    expect(queryByTestId('filter-option-all')).toBeNull();
  });

  it('filters memes by favorites', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny'], isFavorite: true }),
        makeMeme({ id: '2', tags: ['dog'], uri: 'file://meme2.jpg', isFavorite: false }),
      ],
      isLoading: false,
    });

    const { getByTestId, getByText, queryByText } = render(<MemeLibraryScreen />);

    // Open menu and select Favorites
    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));

    expect(getByText('funny')).toBeTruthy();
    expect(queryByText('dog')).toBeNull();
  });

  it('morphs into a glass pill showing active filter label', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme({ id: '1', isFavorite: true })],
      isLoading: false,
    });

    const { getByTestId, getByText, queryByTestId } = render(<MemeLibraryScreen />);

    // No glass pill initially
    expect(queryByTestId('filter-pill')).toBeNull();

    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));

    // Button morphed into glass pill with label
    expect(getByTestId('filter-pill')).toBeTruthy();
    expect(getByText('Favorites')).toBeTruthy();
  });

  it('shows all memes when switching back to All Memes filter', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny'], isFavorite: true }),
        makeMeme({ id: '2', tags: ['dog'], uri: 'file://meme2.jpg', isFavorite: false }),
      ],
      isLoading: false,
    });

    const { getByTestId, getByText } = render(<MemeLibraryScreen />);

    // Select Favorites
    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));

    // Switch back to All
    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-all'));

    expect(getByText('funny')).toBeTruthy();
    expect(getByText('dog')).toBeTruthy();
  });

  it('combines search and filter', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [
        makeMeme({ id: '1', tags: ['funny', 'cat'], isFavorite: true }),
        makeMeme({ id: '2', tags: ['funny', 'dog'], uri: 'file://meme2.jpg', isFavorite: false }),
        makeMeme({ id: '3', tags: ['cat'], uri: 'file://meme3.jpg', isFavorite: true }),
      ],
      isLoading: false,
    });

    const { getByTestId, getByPlaceholderText, queryByText } = render(<MemeLibraryScreen />);

    // Filter by favorites and search for "cat"
    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));
    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'cat');

    // Meme 2 (not favorite) should be excluded
    expect(queryByText('dog')).toBeNull();
  });

  it('shows favorites empty state when no favorites exist', () => {
    mockedUseMemeLibrary.mockReturnValue({
      memes: [makeMeme({ id: '1', tags: ['funny'], isFavorite: false })],
      isLoading: false,
    });

    const { getByTestId, getByText } = render(<MemeLibraryScreen />);

    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-option-favorites'));

    expect(getByText('No favorite memes yet.')).toBeTruthy();
  });
});
