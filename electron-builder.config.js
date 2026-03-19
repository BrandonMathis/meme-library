/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: 'com.memelibrary.app',
  productName: 'MemeLibrary',
  directories: {
    output: 'desktop-build',
  },
  files: ['electron/**/*', 'dist/**/*'],
  extraMetadata: {
    main: 'electron/main.js',
  },
  mac: {
    category: 'public.app-category.entertainment',
    target: ['dmg', 'zip'],
  },
  win: {
    target: ['nsis', 'portable'],
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Utility',
  },
};
