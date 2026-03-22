import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';

/**
 * Watches for incoming share intents (images shared from other apps)
 * and navigates to the AddMemeModal with the shared image URI.
 */
export function useShareIntentHandler() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent || !shareIntent?.files?.length) return;

    const file = shareIntent.files[0];
    if (!file?.path) return;

    // On Android the path may not have a file:// prefix
    const uri =
      Platform.OS === 'android' && !file.path.startsWith('file://')
        ? `file://${file.path}`
        : file.path;

    router.push({ pathname: '/AddMemeModal', params: { uri } });
    resetShareIntent();
  }, [hasShareIntent, shareIntent, resetShareIntent, router]);
}
