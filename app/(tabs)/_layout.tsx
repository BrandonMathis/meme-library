import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" options={{ title: 'Meme Library' }}>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <Label hidden />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add" options={{ title: 'Add Meme' }}>
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} md="add_circle" />
        <Label hidden />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings" options={{ title: 'Settings' }}>
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} md="settings" />
        <Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
