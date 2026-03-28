import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Share, Switch, View } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

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
import { Text } from '@/components/ui/Text';
import { useMemeLibrary } from '@/context/MemeLibrary';
import { useSettings } from '@/context/SettingsContext';
import { useAppTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { THEMES, THEME_IDS, type ThemeId } from '@/lib/themes';

const THEME_PREVIEW_COLORS: Record<ThemeId, string[]> = {
  default: ['hsl(0,0%,9%)', 'hsl(0,0%,45%)', 'hsl(0,0%,96%)'],
  dank: ['hsl(290,100%,45%)', 'hsl(310,70%,72%)', 'hsl(272,60%,78%)'],
  retrowave: ['hsl(335,100%,50%)', 'hsl(185,80%,55%)', 'hsl(325,55%,78%)'],
  pepe: ['hsl(150,80%,28%)', 'hsl(95,55%,60%)', 'hsl(135,50%,75%)'],
  deepfried: ['hsl(15,100%,45%)', 'hsl(45,80%,58%)', 'hsl(35,65%,75%)'],
  ocean: ['hsl(210,95%,38%)', 'hsl(175,65%,55%)', 'hsl(205,60%,75%)'],
  liquidglass: ['hsl(255,80%,50%)', 'hsl(168,55%,60%)', 'hsl(228,45%,78%)'],
};

function ThemeSwatch({ themeId, isActive }: { themeId: ThemeId; isActive: boolean }) {
  const colors = THEME_PREVIEW_COLORS[themeId];
  return (
    <View className="flex-row gap-1">
      {colors.map((color, i) => (
        <View
          key={i}
          style={{ backgroundColor: color, width: 16, height: 16, borderRadius: 8 }}
          className={cn(isActive && 'border-2 border-foreground')}
        />
      ))}
    </View>
  );
}

function BuildInfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="max-w-[60%] text-right font-mono text-sm" numberOfLines={1}>
        {value || 'N/A'}
      </Text>
    </View>
  );
}

function BuildInfoCard() {
  const expoConfig = Constants.expoConfig;
  const appVersion = expoConfig?.version ?? null;
  const runtimeVersion =
    typeof expoConfig?.runtimeVersion === 'string'
      ? expoConfig.runtimeVersion
      : (expoConfig?.runtimeVersion?.policy ?? null);
  const sdkVersion = expoConfig?.sdkVersion ?? null;

  const channel = Updates.channel ?? null;
  const updateId = Updates.updateId ?? null;
  const runtimeVersionFromUpdates = Updates.runtimeVersion ?? null;
  const createdAt = Updates.createdAt ? Updates.createdAt.toISOString() : null;
  const isEmbeddedLaunch = Updates.isEmbeddedLaunch;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Info</CardTitle>
        <CardDescription>App version and update details</CardDescription>
      </CardHeader>
      <CardContent className="gap-3">
        <BuildInfoRow label="App version" value={appVersion} />
        <Separator />
        <BuildInfoRow label="SDK version" value={sdkVersion} />
        <Separator />
        <BuildInfoRow label="Runtime version" value={runtimeVersionFromUpdates ?? runtimeVersion} />
        <Separator />
        <BuildInfoRow label="Update channel" value={channel} />
        <Separator />
        <BuildInfoRow label="Update ID" value={updateId} />
        <Separator />
        <BuildInfoRow label="Published at" value={createdAt} />
        <Separator />
        <BuildInfoRow label="Embedded launch" value={isEmbeddedLaunch ? 'Yes' : 'No'} />
        <Separator />
        <BuildInfoRow label="Platform" value={Platform.OS} />
      </CardContent>
    </Card>
  );
}

export default function SettingsScreen() {
  const { memes, destroyAll, exportData } = useMemeLibrary();
  const { deleteAfterSave, setDeleteAfterSave } = useSettings();
  const { themeId, setTheme } = useAppTheme();
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
      <View className="bg-primary px-4 pb-3 pt-14">
        <Text variant="h3" className="text-primary-foreground">
          Settings
        </Text>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="px-4 gap-4 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>App Theme</CardTitle>
            <CardDescription>Choose a color scheme for your meme library</CardDescription>
          </CardHeader>
          <CardContent className="gap-2">
            {THEME_IDS.map((id) => {
              const theme = THEMES[id];
              const isActive = id === themeId;
              return (
                <Pressable
                  key={id}
                  testID={`theme-${id}`}
                  onPress={() => setTheme(id)}
                  className={cn(
                    'flex-row items-center justify-between rounded-lg border border-border px-4 py-3',
                    isActive && 'border-primary bg-accent',
                  )}
                >
                  <View className="flex-1 gap-0.5">
                    <Text className={cn('font-medium', isActive && 'text-primary')}>
                      {theme.label}
                    </Text>
                    <Text variant="small" className="text-muted-foreground">
                      {theme.description}
                    </Text>
                  </View>
                  <ThemeSwatch themeId={id} isActive={isActive} />
                </Pressable>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo Settings</CardTitle>
            <CardDescription>Configure how photos are handled when saving memes</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-0.5 pr-4">
                <Text className="font-medium">Save Space</Text>
                <Text variant="small" className="text-muted-foreground">
                  Automatically delete saved memes from photo library
                </Text>
              </View>
              <Switch
                testID="delete-after-save-toggle"
                value={deleteAfterSave}
                onValueChange={setDeleteAfterSave}
              />
            </View>
          </CardContent>
        </Card>

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

        <BuildInfoCard />

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
