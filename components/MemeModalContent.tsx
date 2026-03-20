import { View } from 'react-native';
import { Image } from 'expo-image';

import { TagInput } from '@/components/TagInput';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';

interface MemeModalContentProps {
  uri: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  children?: React.ReactNode;
}

export function MemeModalContent({ uri, tags, onTagsChange, children }: MemeModalContentProps) {
  return (
    <>
      <View className="relative overflow-hidden rounded-xl" style={{ height: 320 }}>
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
        {tags.length > 0 && (
          <View
            className="absolute bottom-0 left-0 right-0 flex-row flex-wrap-reverse items-end gap-1.5 p-2"
            style={{ zIndex: 1 }}
            pointerEvents="box-none"
          >
            {tags.map((tag) => (
              <Badge key={tag} onTouchEnd={() => onTagsChange(tags.filter((t) => t !== tag))}>
                <Text className="text-xs text-primary-foreground">{tag} ✕</Text>
              </Badge>
            ))}
          </View>
        )}
      </View>

      <View className="mt-4">
        <TagInput tags={tags} onTagsChange={onTagsChange} showTags={false} />
      </View>

      {children}
    </>
  );
}
