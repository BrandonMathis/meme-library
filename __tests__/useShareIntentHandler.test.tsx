import { renderHook } from '@testing-library/react-native';
import type { ShareIntent } from 'expo-share-intent';

const mockPush = jest.fn();
const mockResetShareIntent = jest.fn();

let mockShareIntentValue: {
  hasShareIntent: boolean;
  shareIntent: ShareIntent;
  resetShareIntent: jest.Mock;
} = {
  hasShareIntent: false,
  shareIntent: { files: null, type: null, webUrl: null },
  resetShareIntent: mockResetShareIntent,
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    dismiss: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('expo-share-intent', () => ({
  useShareIntentContext: () => mockShareIntentValue,
}));

import { useShareIntentHandler } from '@/hooks/use-share-intent-handler';

beforeEach(() => {
  jest.clearAllMocks();
  mockShareIntentValue = {
    hasShareIntent: false,
    shareIntent: { files: null, type: null, webUrl: null },
    resetShareIntent: mockResetShareIntent,
  };
});

describe('useShareIntentHandler', () => {
  it('does nothing when no share intent is present', () => {
    renderHook(() => useShareIntentHandler());
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockResetShareIntent).not.toHaveBeenCalled();
  });

  it('navigates to AddMemeModal when an image is shared', () => {
    mockShareIntentValue = {
      hasShareIntent: true,
      shareIntent: {
        files: [
          {
            path: 'file:///tmp/shared-image.jpg',
            fileName: 'shared-image.jpg',
            mimeType: 'image/jpeg',
            size: 12345,
            width: 800,
            height: 600,
            duration: null,
          },
        ],
        type: 'media',
        webUrl: null,
      },
      resetShareIntent: mockResetShareIntent,
    };

    renderHook(() => useShareIntentHandler());

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/AddMemeModal',
      params: { uri: 'file:///tmp/shared-image.jpg' },
    });
    expect(mockResetShareIntent).toHaveBeenCalled();
  });

  it('does nothing when hasShareIntent is true but files are empty', () => {
    mockShareIntentValue = {
      hasShareIntent: true,
      shareIntent: { files: [], type: 'media', webUrl: null },
      resetShareIntent: mockResetShareIntent,
    };

    renderHook(() => useShareIntentHandler());
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does nothing when hasShareIntent is true but files are null', () => {
    mockShareIntentValue = {
      hasShareIntent: true,
      shareIntent: { files: null, type: null, webUrl: null },
      resetShareIntent: mockResetShareIntent,
    };

    renderHook(() => useShareIntentHandler());
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does nothing when file has no path', () => {
    mockShareIntentValue = {
      hasShareIntent: true,
      shareIntent: {
        files: [
          {
            path: '',
            fileName: 'image.jpg',
            mimeType: 'image/jpeg',
            size: 0,
            width: null,
            height: null,
            duration: null,
          },
        ],
        type: 'media',
        webUrl: null,
      },
      resetShareIntent: mockResetShareIntent,
    };

    renderHook(() => useShareIntentHandler());
    expect(mockPush).not.toHaveBeenCalled();
  });
});
