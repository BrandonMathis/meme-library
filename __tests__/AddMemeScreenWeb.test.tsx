/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, render, fireEvent } from '@testing-library/react-native';

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

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn((blob: unknown) => `blob:http://localhost/${Math.random()}`);
global.URL.createObjectURL = mockCreateObjectURL;

// Track created input elements
let capturedInputs: HTMLInputElement[] = [];
const originalCreateElement = document.createElement.bind(document);
jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
  const el = originalCreateElement(tag);
  if (tag === 'input') {
    // Mock click to prevent JSDOM errors
    el.click = jest.fn();
    capturedInputs.push(el as HTMLInputElement);
  }
  return el;
});

import AddMemeScreen from '@/app/(tabs)/add.web';

beforeEach(() => {
  jest.clearAllMocks();
  capturedInputs = [];
});

describe('AddMemeScreen (Web)', () => {
  it('renders the add meme heading and upload instructions', () => {
    const { getByText } = render(<AddMemeScreen />);
    expect(getByText('Add Meme')).toBeTruthy();
    expect(getByText('Upload an image to add it to your library')).toBeTruthy();
  });

  it('renders drag and drop zone text', () => {
    const { getByText } = render(<AddMemeScreen />);
    expect(getByText('Drag & drop an image')).toBeTruthy();
    expect(getByText('or click to browse your files')).toBeTruthy();
  });

  it('renders choose file button', () => {
    const { getByText } = render(<AddMemeScreen />);
    expect(getByText('Choose File')).toBeTruthy();
  });

  it('renders select multiple files button', () => {
    const { getByText } = render(<AddMemeScreen />);
    expect(getByText('Select Multiple Files')).toBeTruthy();
  });

  it('opens file picker when choose file button is pressed', () => {
    const { getByTestId } = render(<AddMemeScreen />);
    fireEvent.press(getByTestId('choose-file-button'));

    // Should have created an input element
    expect(capturedInputs.length).toBeGreaterThan(0);
    const input = capturedInputs[capturedInputs.length - 1];
    expect(input.type).toBe('file');
    expect(input.accept).toBe('image/*');
    expect(input.click).toHaveBeenCalled();
  });

  it('navigates to AddMemeModal when a file is selected', () => {
    const { getByTestId } = render(<AddMemeScreen />);
    fireEvent.press(getByTestId('choose-file-button'));

    const input = capturedInputs[capturedInputs.length - 1];
    const mockFile = new File(['image-data'], 'meme.png', { type: 'image/png' });

    // Simulate file selection
    Object.defineProperty(input, 'files', { value: [mockFile], configurable: true });
    input.dispatchEvent(new Event('change'));

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/AddMemeModal',
      params: { uri: expect.any(String), assetId: '' },
    });
  });

  it('opens multi-file picker when select multiple is pressed', () => {
    const { getByTestId } = render(<AddMemeScreen />);
    fireEvent.press(getByTestId('choose-multiple-button'));

    const input = capturedInputs[capturedInputs.length - 1];
    expect(input.type).toBe('file');
    expect(input.accept).toBe('image/*');
    expect(input.multiple).toBe(true);
    expect(input.click).toHaveBeenCalled();
  });

  it('navigates directly when a single file is selected via multiple picker', () => {
    const { getByTestId } = render(<AddMemeScreen />);
    fireEvent.press(getByTestId('choose-multiple-button'));

    const input = capturedInputs[capturedInputs.length - 1];
    const mockFile = new File(['data'], 'meme.png', { type: 'image/png' });

    Object.defineProperty(input, 'files', { value: [mockFile], configurable: true });
    input.dispatchEvent(new Event('change'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/AddMemeModal',
      params: { uri: expect.any(String), assetId: '' },
    });
  });

  it('shows image grid when multiple files are selected', async () => {
    const { getByTestId, getByText } = render(<AddMemeScreen />);
    fireEvent.press(getByTestId('choose-multiple-button'));

    const input = capturedInputs[capturedInputs.length - 1];
    const mockFiles = [
      new File(['data1'], 'meme1.png', { type: 'image/png' }),
      new File(['data2'], 'meme2.png', { type: 'image/png' }),
    ];

    Object.defineProperty(input, 'files', { value: mockFiles, configurable: true });
    await act(async () => {
      input.dispatchEvent(new Event('change'));
    });

    // Should show the selection grid, not navigate
    expect(mockPush).not.toHaveBeenCalled();
    expect(getByText('Select a Photo')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });
});
