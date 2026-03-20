import { useRef, useState } from 'react';
import { View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="muted">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-4">
        <Text variant="h4">Camera Access Required</Text>
        <Text variant="muted" className="text-center">
          Please grant camera access to use this feature.
        </Text>
        <Button onPress={requestPermission}>
          <Text className="text-primary-foreground">Grant Permission</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute bottom-12 left-0 right-0 flex-row items-center justify-center gap-4">
          <Button
            variant="secondary"
            onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
          >
            <Text>Flip</Text>
          </Button>
        </View>
      </CameraView>
    </View>
  );
}
