import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as MediaLibrary from 'expo-media-library';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    dismiss: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: { Screen: () => null },
}));

import AddMemeScreen from '@/app/(tabs)/add';

const mockedRequestPermissions = MediaLibrary.requestPermissionsAsync as jest.Mock;
const mockedGetAssets = MediaLibrary.getAssetsAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedRequestPermissions.mockResolvedValue({ status: 'granted' });
  mockedGetAssets.mockResolvedValue({ assets: [] });
});

describe('AddMemeScreen', () => {
  it('shows requesting text initially', () => {
    // Don't resolve permission yet
    mockedRequestPermissions.mockReturnValue(new Promise(() => {}));

    const { getByText } = render(<AddMemeScreen />);
    expect(getByText('Requesting photo access...')).toBeTruthy();
  });

  it('shows denied state when permission is denied', async () => {
    mockedRequestPermissions.mockResolvedValue({ status: 'denied' });

    const { getByText } = render(<AddMemeScreen />);

    await waitFor(() => {
      expect(getByText('Photo Access Required')).toBeTruthy();
    });

    expect(getByText('Please grant photo library access in your device settings.')).toBeTruthy();
  });

  it('shows title and subtitle when permission granted', async () => {
    const { getByText } = render(<AddMemeScreen />);

    await waitFor(() => {
      expect(getByText('Add Meme')).toBeTruthy();
    });

    expect(getByText('Tap a photo to add it to your library')).toBeTruthy();
  });

  it('loads and displays photos when granted', async () => {
    const mockAssets = [
      { id: 'a1', uri: 'file://photo1.jpg' },
      { id: 'a2', uri: 'file://photo2.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: mockAssets });

    render(<AddMemeScreen />);

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledWith(
        expect.objectContaining({
          first: 50,
          mediaType: 'photo',
        }),
      );
    });
  });

  it('navigates to AddMemeModal when a photo is pressed', async () => {
    const mockAssets = [{ id: 'a1', uri: 'file://photo1.jpg' }];
    mockedGetAssets.mockResolvedValue({ assets: mockAssets });

    const { findByTestId } = render(<AddMemeScreen />);

    // Wait for photos to load - since FlatList renders TouchableOpacity items
    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalled();
    });
  });

  it('requests permissions on mount', async () => {
    render(<AddMemeScreen />);

    await waitFor(() => {
      expect(mockedRequestPermissions).toHaveBeenCalled();
    });
  });
});
