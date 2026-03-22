import React from 'react';
import { render, waitFor, within } from '@testing-library/react-native';

import SettingsScreen from '@/app/(tabs)/settings';
import { MemeLibraryProvider } from '@/context/MemeLibrary';
import { SettingsProvider } from '@/context/SettingsContext';
import { AppThemeProvider } from '@/context/ThemeContext';

function renderSettings() {
  return render(
    <SettingsProvider>
      <MemeLibraryProvider>
        <AppThemeProvider>
          <SettingsScreen />
        </AppThemeProvider>
      </MemeLibraryProvider>
    </SettingsProvider>,
  );
}

describe('Settings Build Info', () => {
  it('renders the Build Info card with version details', async () => {
    const { getByText, getAllByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('Build Info')).toBeTruthy();
    });

    expect(getByText('App version')).toBeTruthy();
    expect(getByText('1.0.0')).toBeTruthy();
    expect(getByText('SDK version')).toBeTruthy();
    expect(getAllByText('54.0.0').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Update channel')).toBeTruthy();
    expect(getByText('preview')).toBeTruthy();
  });

  it('renders update and platform info', async () => {
    const { getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('Build Info')).toBeTruthy();
    });

    expect(getByText('Update ID')).toBeTruthy();
    expect(getByText('test-update-id-123')).toBeTruthy();
    expect(getByText('Platform')).toBeTruthy();
    expect(getByText('Embedded launch')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });
});
