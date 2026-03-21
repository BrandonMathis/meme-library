// Polyfill global for expo
if (typeof globalThis.__ExpoImportMetaRegistry === 'undefined') {
  globalThis.__ExpoImportMetaRegistry = {};
}

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: jest.fn(({ children }) => children),
  Gesture: {
    Pan: () => ({
      onUpdate: function () {
        return {
          onEnd: function () {
            return {};
          },
        };
      },
    }),
  },
  GestureHandlerRootView: jest.fn(({ children }) => children),
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: jest.fn(() => null),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    dismiss: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Link: jest.fn(({ children }) => children),
}));

// Mock expo-media-library
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getAssetsAsync: jest.fn(() => Promise.resolve({ assets: [] })),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  SortBy: { creationTime: 'creationTime' },
}));

// Mock expo-sharing
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock/documents/',
  Paths: { cache: '/mock/cache/' },
  File: {
    downloadFileAsync: jest.fn(),
  },
}));

// Mock expo-symbols
jest.mock('expo-symbols', () => ({}));

// Mock @/components/ui/IconSymbol
jest.mock('@/components/ui/IconSymbol', () => ({
  IconSymbol: jest.fn(({ name }) => name),
}));

// Mock meme-storage
jest.mock('@/lib/meme-storage', () => ({
  getAllMemes: jest.fn(() => Promise.resolve([])),
  insertMeme: jest.fn(() => Promise.resolve()),
  removeMeme: jest.fn(() => Promise.resolve(null)),
  updateMemeFavorite: jest.fn(() => Promise.resolve()),
  updateMemeTags: jest.fn(() => Promise.resolve()),
  destroyAll: jest.fn(() => Promise.resolve()),
  exportData: jest.fn(() => Promise.resolve('[]')),
  copyImageToLocal: jest.fn((uri, id) => Promise.resolve('/local/' + id + '.jpg')),
  deleteLocalImage: jest.fn(() => Promise.resolve()),
}));

// Mock theme-storage
jest.mock('@/lib/theme-storage', () => ({
  loadThemeId: jest.fn(() => Promise.resolve(null)),
  saveThemeId: jest.fn(() => Promise.resolve()),
}));

// Mock nativewind vars
jest.mock('nativewind', () => ({
  vars: jest.fn((obj) => obj),
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: jest.fn(({ children }) => children),
  SafeAreaView: jest.fn(({ children }) => children),
}));

// Silence console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Animated') ||
      args[0].includes('NativeWind') ||
      args[0].includes('error boundary'))
  ) {
    return;
  }
  originalWarn(...args);
};
