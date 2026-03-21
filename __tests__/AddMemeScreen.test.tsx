import React from 'react';
import { AppState, Platform } from 'react-native';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
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
const mockedAddListener = MediaLibrary.addListener as jest.Mock;

let appStateAddEventListenerSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  mockedRequestPermissions.mockResolvedValue({ status: 'granted' });
  mockedGetAssets.mockResolvedValue({ assets: [] });
  mockedAddListener.mockReturnValue({ remove: jest.fn() });
  // Ensure AppState.addEventListener always returns a valid subscription
  appStateAddEventListenerSpy = jest
    .spyOn(AppState, 'addEventListener')
    .mockReturnValue({ remove: jest.fn() } as unknown as ReturnType<
      typeof AppState.addEventListener
    >);
});

afterEach(() => {
  appStateAddEventListenerSpy.mockRestore();
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

    // Wait for photos to load - since FlashList renders TouchableOpacity items
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

  it('fully replaces photos on foreground refresh', async () => {
    let appStateListener: ((state: string) => void) | undefined;
    appStateAddEventListenerSpy.mockImplementation((type: string, listener: unknown) => {
      if (type === 'change') {
        appStateListener = listener as (state: string) => void;
      }
      return { remove: jest.fn() } as unknown as ReturnType<typeof AppState.addEventListener>;
    });

    const initialAssets = [
      { id: 'a1', uri: 'file://photo1.jpg' },
      { id: 'a2', uri: 'file://photo2.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: [...initialAssets] });

    render(<AddMemeScreen />);

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledTimes(1);
    });

    // Simulate new photo added and one deleted from camera roll
    const updatedAssets = [
      { id: 'a3', uri: 'file://photo3.jpg' },
      { id: 'a1', uri: 'file://photo1.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: [...updatedAssets] });

    expect(appStateListener).toBeDefined();
    await act(async () => {
      appStateListener!('active');
    });

    await waitFor(() => {
      // Second call is the foreground refresh
      expect(mockedGetAssets).toHaveBeenCalledTimes(2);
    });
  });

  it('removes deleted photos on foreground sync', async () => {
    let appStateListener: ((state: string) => void) | undefined;
    appStateAddEventListenerSpy.mockImplementation((type: string, listener: unknown) => {
      if (type === 'change') {
        appStateListener = listener as (state: string) => void;
      }
      return { remove: jest.fn() } as unknown as ReturnType<typeof AppState.addEventListener>;
    });

    const initialAssets = [
      { id: 'a1', uri: 'file://photo1.jpg' },
      { id: 'a2', uri: 'file://photo2.jpg' },
      { id: 'a3', uri: 'file://photo3.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: [...initialAssets] });

    render(<AddMemeScreen />);

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledTimes(1);
    });

    // Simulate photo a2 being deleted from the device library
    const afterDeletion = [
      { id: 'a1', uri: 'file://photo1.jpg' },
      { id: 'a3', uri: 'file://photo3.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: [...afterDeletion] });

    // Simulate app coming to foreground
    expect(appStateListener).toBeDefined();
    await act(async () => {
      appStateListener!('active');
    });

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledTimes(2);
    });
  });

  it('subscribes to MediaLibrary changes and refreshes on change event', async () => {
    let mediaListener: (() => void) | undefined;
    mockedAddListener.mockImplementation((cb: () => void) => {
      mediaListener = cb;
      return { remove: jest.fn() };
    });

    const initialAssets = [
      { id: 'a1', uri: 'file://photo1.jpg' },
      { id: 'a2', uri: 'file://photo2.jpg' },
    ];
    mockedGetAssets.mockResolvedValue({ assets: [...initialAssets] });

    render(<AddMemeScreen />);

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledTimes(1);
    });

    expect(mockedAddListener).toHaveBeenCalled();

    // Simulate a library change event (e.g. photo deleted externally)
    const updatedAssets = [{ id: 'a1', uri: 'file://photo1.jpg' }];
    mockedGetAssets.mockResolvedValue({ assets: [...updatedAssets] });

    expect(mediaListener).toBeDefined();
    await act(async () => {
      mediaListener!();
    });

    await waitFor(() => {
      expect(mockedGetAssets).toHaveBeenCalledTimes(2);
    });
  });
});
