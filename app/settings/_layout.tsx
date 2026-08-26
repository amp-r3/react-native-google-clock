import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="theme" options={{ title: 'Display' }} />
      <Stack.Screen name="home-timezone" options={{ title: 'Home time zone', headerShown: false }} />
      <Stack.Screen name="snooze-length" options={{ title: 'Snooze length' }} />
      <Stack.Screen name="silence-after" options={{ title: 'Silence after' }} />
      <Stack.Screen name="volume" options={{ title: 'Alarm volume' }} />
      <Stack.Screen name="timer-sound" options={{ title: 'Timer sound' }} />
    </Stack>
  );
}
