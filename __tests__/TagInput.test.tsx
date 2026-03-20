import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { TagInput } from '@/components/TagInput';

describe('TagInput', () => {
  const mockOnTagsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with default placeholder', () => {
    const { getByPlaceholderText } = render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);
    expect(getByPlaceholderText('Add a tag...')).toBeTruthy();
  });

  it('renders input with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} placeholder="Enter tag" />,
    );
    expect(getByPlaceholderText('Enter tag')).toBeTruthy();
  });

  it('adds a tag when pressing the add button', () => {
    const { getByPlaceholderText, getByText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} />,
    );

    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'funny');
    fireEvent.press(getByText('+'));

    expect(mockOnTagsChange).toHaveBeenCalledWith(['funny']);
  });

  it('normalizes tags to lowercase and trimmed', () => {
    const { getByPlaceholderText, getByText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} />,
    );

    fireEvent.changeText(getByPlaceholderText('Add a tag...'), '  FUNNY  ');
    fireEvent.press(getByText('+'));

    expect(mockOnTagsChange).toHaveBeenCalledWith(['funny']);
  });

  it('prevents adding duplicate tags', () => {
    const { getByPlaceholderText, getByText } = render(
      <TagInput tags={['funny']} onTagsChange={mockOnTagsChange} />,
    );

    fireEvent.changeText(getByPlaceholderText('Add a tag...'), 'funny');
    fireEvent.press(getByText('+'));

    expect(mockOnTagsChange).not.toHaveBeenCalled();
  });

  it('prevents adding empty tags', () => {
    const { getByPlaceholderText, getByText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} />,
    );

    fireEvent.changeText(getByPlaceholderText('Add a tag...'), '   ');
    fireEvent.press(getByText('+'));

    expect(mockOnTagsChange).not.toHaveBeenCalled();
  });

  it('adds a tag on submit editing (keyboard return)', () => {
    const { getByPlaceholderText } = render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

    const input = getByPlaceholderText('Add a tag...');
    fireEvent.changeText(input, 'meme');
    fireEvent(input, 'submitEditing');

    expect(mockOnTagsChange).toHaveBeenCalledWith(['meme']);
  });

  it('displays existing tags as badges', () => {
    const { getByText } = render(
      <TagInput tags={['funny', 'cat']} onTagsChange={mockOnTagsChange} />,
    );

    expect(getByText('funny ✕')).toBeTruthy();
    expect(getByText('cat ✕')).toBeTruthy();
  });

  it('hides tags when showTags is false', () => {
    const { queryByText } = render(
      <TagInput tags={['funny', 'cat']} onTagsChange={mockOnTagsChange} showTags={false} />,
    );

    expect(queryByText('funny ✕')).toBeNull();
    expect(queryByText('cat ✕')).toBeNull();
  });

  it('removes a tag when badge is tapped', () => {
    const { getByText } = render(
      <TagInput tags={['funny', 'cat']} onTagsChange={mockOnTagsChange} />,
    );

    fireEvent(getByText('funny ✕'), 'touchEnd');

    expect(mockOnTagsChange).toHaveBeenCalledWith(['cat']);
  });

  it('clears input after successfully adding a tag', () => {
    const { getByPlaceholderText, getByText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} />,
    );

    const input = getByPlaceholderText('Add a tag...');
    fireEvent.changeText(input, 'funny');
    fireEvent.press(getByText('+'));

    expect(input.props.value).toBe('');
  });

  it('does not show tags section when tags array is empty', () => {
    const { queryByText } = render(
      <TagInput tags={[]} onTagsChange={mockOnTagsChange} showTags={true} />,
    );

    // No tag badges should exist
    expect(queryByText(/✕/)).toBeNull();
  });
});
