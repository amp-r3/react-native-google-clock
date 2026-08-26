import { Stack } from "expo-router";
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { persistor, store } from "../src/store/store";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import { toastConfig } from "../src/components/ToastConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

function RootLayoutNav() {
  const { colors, resolvedScheme } = useTheme();

  useEffect(() => {
    setStatusBarStyle(resolvedScheme === 'dark' ? 'light' : 'dark');
  }, [resolvedScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ animation: 'default' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-alarm"
          options={{
            title: 'New Alarm',
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="add-clock"
          options={{
            title: 'New Clock',
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="alarmScreen"
          options={{
            presentation: 'modal',
            headerShown: false,
            statusBarHidden: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
      <Toast config={toastConfig} bottomOffset={120} />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
