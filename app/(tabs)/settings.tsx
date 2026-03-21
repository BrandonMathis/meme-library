import { useState } from 'react';
import { Alert, Platform, ScrollView, Share, View } from 'react-native';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Text } from '@/components/ui/Text';
import { useMemeLibrary } from '@/context/MemeLibrary';
import { useTheme } from '@/context/ThemeProvider';

export default function SettingsScreen() {
  const { memes, destroyAll, exportData } = useMemeLibrary();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isDestroying, setIsDestroying] = useState(false);

  const totalTags = new Set(memes.flatMap((m) => m.tags)).size;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportData();
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme-library-export.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({ message: json, title: 'Meme Library Export' });
      }
    } catch {
      Alert.alert('Export Failed', 'Something went wrong while exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDestroy = async () => {
    setIsDestroying(true);
    try {
      await destroyAll();
    } finally {
      setIsDestroying(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-3 pt-14">
        <Text variant="h3">Settings</Text>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="px-4 gap-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Library Stats</CardTitle>
            <CardDescription>Overview of your meme collection</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">Total memes</Text>
              <Text className="font-semibold">{memes.length}</Text>
            </View>
            <Separator />
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">Unique tags</Text>
              <Text className="font-semibold">{totalTags}</Text>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="shrink gap-0.5">
                <Text className="font-medium">Dark Mode</Text>
                <Text variant="small" className="text-muted-foreground">
                  {themeMode === 'system'
                    ? 'Following system theme'
                    : isDark
                      ? 'Dark theme active'
                      : 'Light theme active'}
                </Text>
              </View>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => setThemeMode(checked ? 'dark' : 'light')}
              />
            </View>
            <Separator />
            <View className="flex-row items-center justify-between">
              <View className="shrink gap-0.5">
                <Text className="font-medium">Use System Theme</Text>
                <Text variant="small" className="text-muted-foreground">
                  Match your device&apos;s appearance setting
                </Text>
              </View>
              <Switch
                checked={themeMode === 'system'}
                onCheckedChange={(checked) =>
                  setThemeMode(checked ? 'system' : isDark ? 'dark' : 'light')
                }
              />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or manage your meme library data</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <View className="gap-1">
              <Text className="font-medium">Export Library</Text>
              <Text variant="small" className="text-muted-foreground">
                Export all meme metadata (tags, dates) as JSON. Does not include image files.
              </Text>
              <Button
                className="mt-2"
                variant="outline"
                onPress={handleExport}
                disabled={memes.length === 0 || isExporting}
              >
                <Text>{isExporting ? 'Exporting...' : 'Export as JSON'}</Text>
              </Button>
            </View>

            <Separator />

            <View className="gap-1">
              <Text className="font-medium text-destructive">Delete All Data</Text>
              <Text variant="small" className="text-muted-foreground">
                Permanently delete all memes and their locally stored images. This cannot be undone.
              </Text>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mt-2" variant="destructive" disabled={memes.length === 0}>
                    <Text className="text-white">Delete All Memes</Text>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {memes.length} meme
                      {memes.length !== 1 && 's'} and their stored images. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <Text>Cancel</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onPress={handleDestroy}
                      disabled={isDestroying}
                    >
                      <Text className="text-white">
                        {isDestroying ? 'Deleting...' : 'Delete Everything'}
                      </Text>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
