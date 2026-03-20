import React from 'react';
import { render } from '@testing-library/react-native';

const mockUseMemeLibrary = jest.fn();

jest.mock('@/context/MemeLibrary', () => ({
  useMemeLibrary: () => mockUseMemeLibrary(),
}));

import { SuccessAnimation } from '@/components/SuccessAnimation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SuccessAnimation', () => {
  it('returns null when lastAddedId is null', () => {
    mockUseMemeLibrary.mockReturnValue({
      lastAddedId: null,
      clearLastAdded: jest.fn(),
    });

    const { toJSON } = render(<SuccessAnimation />);
    expect(toJSON()).toBeNull();
  });

  it('renders the success message when lastAddedId is set', () => {
    mockUseMemeLibrary.mockReturnValue({
      lastAddedId: '123',
      clearLastAdded: jest.fn(),
    });

    const { getByText } = render(<SuccessAnimation />);
    expect(getByText('Meme Saved!')).toBeTruthy();
  });

  it('renders the success overlay when lastAddedId is set', () => {
    mockUseMemeLibrary.mockReturnValue({
      lastAddedId: '456',
      clearLastAdded: jest.fn(),
    });

    const { toJSON } = render(<SuccessAnimation />);
    // Should render the overlay structure (not null)
    expect(toJSON()).not.toBeNull();
  });
});
