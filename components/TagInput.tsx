import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  showTags?: boolean;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Add a tag...',
  showTags = true,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInputValue('');
      // Imperatively clear the native input to handle cases where
      // selected text causes the controlled value to not update properly
      inputRef.current?.clear();
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
            autoCapitalize="none"
          />
        </View>
        <Button size="icon" onPress={handleAddTag}>
          <Text className="text-lg font-bold text-primary-foreground">+</Text>
        </Button>
      </View>

      {showTags && tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} onTouchEnd={() => handleRemoveTag(tag)}>
              <Text className="text-xs text-primary-foreground">{tag} ✕</Text>
            </Badge>
          ))}
        </View>
      )}
    </View>
  );
}
