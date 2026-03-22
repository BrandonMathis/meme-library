import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import SettingsScreen from '@/app/(tabs)/settings';
import { MemeLibraryProvider } from '@/context/MemeLibrary';
import { SettingsProvider } from '@/context/SettingsContext';
import { AppThemeProvider } from '@/context/ThemeContext';
import { THEME_IDS, THEMES } from '@/lib/themes';

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

describe('Settings Theme Picker', () => {
  it('renders all theme options', async () => {
    const { getByTestId, getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('App Theme')).toBeTruthy();
    });

    for (const id of THEME_IDS) {
      expect(getByTestId(`theme-${id}`)).toBeTruthy();
      expect(getByText(THEMES[id].label)).toBeTruthy();
    }
  });

  it('allows selecting a theme', async () => {
    const { getByTestId, getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('App Theme')).toBeTruthy();
    });

    fireEvent.press(getByTestId('theme-dank'));
    // The dank theme button should now be pressable and the theme label visible
    expect(getByText('Dank Mode')).toBeTruthy();
  });

  it('shows the Liquid Glass theme option', async () => {
    const { getByTestId, getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('Liquid Glass')).toBeTruthy();
    });

    expect(getByTestId('theme-liquidglass')).toBeTruthy();
    expect(getByText('Translucent blue-purple-mint aero')).toBeTruthy();
  });

  it('renders the delete-after-save toggle', async () => {
    const { getByTestId, getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('Photo Settings')).toBeTruthy();
    });

    expect(getByText('Delete from Camera Roll')).toBeTruthy();
    expect(getByTestId('delete-after-save-toggle')).toBeTruthy();
  });

  it('toggles delete-after-save setting', async () => {
    const { getByTestId, getByText } = renderSettings();

    await waitFor(() => {
      expect(getByText('Photo Settings')).toBeTruthy();
    });

    const toggle = getByTestId('delete-after-save-toggle');
    expect(toggle.props.value).toBe(false);

    fireEvent(toggle, 'valueChange', true);
    expect(toggle.props.value).toBe(true);
  });
});
