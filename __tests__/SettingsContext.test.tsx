import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { loadDeleteAfterSave, saveDeleteAfterSave } from '@/lib/settings-storage';

const mockedLoadDeleteAfterSave = loadDeleteAfterSave as jest.Mock;
const mockedSaveDeleteAfterSave = saveDeleteAfterSave as jest.Mock;

function TestConsumer() {
  const { deleteAfterSave, setDeleteAfterSave, isLoading } = useSettings();

  return (
    <>
      <Text testID="loading">{isLoading ? 'true' : 'false'}</Text>
      <Text testID="delete-after-save">{deleteAfterSave ? 'true' : 'false'}</Text>
      <Pressable testID="toggle" onPress={() => setDeleteAfterSave(!deleteAfterSave)} />
      <Pressable testID="enable" onPress={() => setDeleteAfterSave(true)} />
      <Pressable testID="disable" onPress={() => setDeleteAfterSave(false)} />
    </>
  );
}

function renderWithProvider() {
  return render(
    <SettingsProvider>
      <TestConsumer />
    </SettingsProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedLoadDeleteAfterSave.mockResolvedValue(false);
});

describe('SettingsContext', () => {
  it('starts in loading state and loads setting on mount', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('delete-after-save').props.children).toBe('false');
    expect(loadDeleteAfterSave).toHaveBeenCalledTimes(1);
  });

  it('loads saved true value', async () => {
    mockedLoadDeleteAfterSave.mockResolvedValue(true);

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('delete-after-save').props.children).toBe('true');
  });

  it('toggles the setting and persists it', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('enable'));
    });

    expect(getByTestId('delete-after-save').props.children).toBe('true');
    expect(mockedSaveDeleteAfterSave).toHaveBeenCalledWith(true);

    await act(async () => {
      fireEvent.press(getByTestId('disable'));
    });

    expect(getByTestId('delete-after-save').props.children).toBe('false');
    expect(mockedSaveDeleteAfterSave).toHaveBeenCalledWith(false);
  });
});
