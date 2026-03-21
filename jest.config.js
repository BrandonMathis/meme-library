/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@rn-primitives/.*|@shopify/flash-list|nativewind|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|class-variance-authority|clsx|tailwind-merge|expo-image|expo-router|expo-modules-core|expo-file-system|expo-media-library|expo-sharing|expo-sqlite|expo-symbols|expo-linking|expo-constants|expo-font|expo-splash-screen|expo-status-bar|expo-system-ui|expo-updates)',
  ],
  setupFiles: ['<rootDir>/__mocks__/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
};
