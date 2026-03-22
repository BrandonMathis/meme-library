import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

function createFileInput(onSelect: (uri: string) => void): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = false;
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) {
      onSelect(URL.createObjectURL(file));
    }
  });
  return input;
}

export default function AddMemeScreen() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropZoneRef = useRef<View>(null);

  const handleImageSelected = useCallback(
    (uri: string) => {
      router.push({ pathname: '/AddMemeModal', params: { uri, assetId: '' } });
    },
    [router],
  );

  const handleChooseFile = useCallback(() => {
    if (!fileInputRef.current) {
      fileInputRef.current = createFileInput(handleImageSelected);
    }
    fileInputRef.current.click();
  }, [handleImageSelected]);

  const handleChooseMultiple = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.addEventListener('change', () => {
      const files = input.files;
      if (files && files.length > 0) {
        const uris = Array.from(files).map((f) => URL.createObjectURL(f));
        if (uris.length === 1) {
          handleImageSelected(uris[0]);
        } else {
          setSelectedImages(uris);
        }
      }
    });
    input.click();
  }, [handleImageSelected]);

  // Attach drag-and-drop DOM events via ref (web-only)
  useEffect(() => {
    const node = dropZoneRef.current as unknown as HTMLElement | null;
    if (!node || typeof node.addEventListener !== 'function') return;

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleImageSelected(URL.createObjectURL(file));
      }
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const onDragLeave = () => setIsDragOver(false);

    node.addEventListener('drop', onDrop);
    node.addEventListener('dragover', onDragOver);
    node.addEventListener('dragleave', onDragLeave);

    return () => {
      node.removeEventListener('drop', onDrop);
      node.removeEventListener('dragover', onDragOver);
      node.removeEventListener('dragleave', onDragLeave);
    };
  }, [handleImageSelected]);

  if (selectedImages.length > 0) {
    return (
      <View className="flex-1 bg-background">
        <View className="px-4 pb-3 pt-14">
          <Text variant="h3">Select a Photo</Text>
          <Text variant="muted" className="mt-1">
            Tap a photo to add it to your library
          </Text>
        </View>
        <View className="flex-1 flex-row flex-wrap gap-1 px-2">
          {selectedImages.map((uri) => (
            <Pressable
              key={uri}
              onPress={() => {
                setSelectedImages([]);
                handleImageSelected(uri);
              }}
            >
              <Image source={{ uri }} style={{ width: 120, height: 120, borderRadius: 8 }} />
            </Pressable>
          ))}
        </View>
        <View className="px-4 pb-8 pt-4">
          <Button variant="outline" onPress={() => setSelectedImages([])}>
            <Text>Back</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-3 pt-14">
        <Text variant="h3">Add Meme</Text>
        <Text variant="muted" className="mt-1">
          Upload an image to add it to your library
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <Pressable
          ref={dropZoneRef}
          onPress={handleChooseFile}
          className={`w-full max-w-lg items-center justify-center rounded-2xl border-2 border-dashed p-12 ${
            isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
          }`}
          testID="drop-zone"
        >
          <Text variant="h4" className="mb-2">
            {isDragOver ? 'Drop image here' : 'Drag & drop an image'}
          </Text>
          <Text variant="muted" className="mb-6 text-center">
            or click to browse your files
          </Text>
          <Button onPress={handleChooseFile} testID="choose-file-button">
            <Text className="text-primary-foreground">Choose File</Text>
          </Button>
        </Pressable>

        <View className="mt-4">
          <Button variant="outline" onPress={handleChooseMultiple} testID="choose-multiple-button">
            <Text>Select Multiple Files</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
