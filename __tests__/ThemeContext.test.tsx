import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import { AppThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { loadThemeId, saveThemeId } from '@/lib/theme-storage';

const mockedLoadThemeId = loadThemeId as jest.Mock;
const mockedSaveThemeId = saveThemeId as jest.Mock;

function TestConsumer() {
  const { themeId, setTheme, isLoading } = useAppTheme();

  return (
    <>
      <Text testID="loading">{isLoading ? 'true' : 'false'}</Text>
      <Text testID="theme-id">{themeId}</Text>
      <Pressable testID="set-dank" onPress={() => setTheme('dank')} />
      <Pressable testID="set-ocean" onPress={() => setTheme('ocean')} />
      <Pressable testID="set-liquidglass" onPress={() => setTheme('liquidglass')} />
      <Pressable testID="set-default" onPress={() => setTheme('default')} />
    </>
  );
}

function renderWithProvider() {
  return render(
    <AppThemeProvider>
      <TestConsumer />
    </AppThemeProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedLoadThemeId.mockResolvedValue(null);
  mockedSaveThemeId.mockResolvedValue(undefined);
});

describe('ThemeContext', () => {
  it('starts with default theme and loading state', async () => {
    const { getByTestId } = renderWithProvider();

    expect(getByTestId('theme-id').props.children).toBe('default');

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });
  });

  it('loads saved theme on mount', async () => {
    mockedLoadThemeId.mockResolvedValue('dank');

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('theme-id').props.children).toBe('dank');
    });
    expect(getByTestId('loading').props.children).toBe('false');
  });

  it('ignores invalid saved theme values', async () => {
    mockedLoadThemeId.mockResolvedValue('nonexistent-theme');

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });
    expect(getByTestId('theme-id').props.children).toBe('default');
  });

  it('changes theme and persists', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('set-dank'));
    });

    expect(getByTestId('theme-id').props.children).toBe('dank');
    expect(mockedSaveThemeId).toHaveBeenCalledWith('dank');
  });

  it('can switch between multiple themes', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('set-ocean'));
    });
    expect(getByTestId('theme-id').props.children).toBe('ocean');

    await act(async () => {
      fireEvent.press(getByTestId('set-liquidglass'));
    });
    expect(getByTestId('theme-id').props.children).toBe('liquidglass');

    await act(async () => {
      fireEvent.press(getByTestId('set-default'));
    });
    expect(getByTestId('theme-id').props.children).toBe('default');
  });
});
