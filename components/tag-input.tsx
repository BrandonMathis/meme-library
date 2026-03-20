import { useState } from 'react';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onTagsChange, placeholder = 'Add a tag...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInputValue('');
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

      {tags.length > 0 && (
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
