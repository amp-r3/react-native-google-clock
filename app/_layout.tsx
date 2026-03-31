import { Stack } from "expo-router";
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from "../src/store/store";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import Toast from 'react-native-toast-message';
import { toastConfig } from "../src/components/ToastConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    setStatusBarStyle('light');
  }, [colorScheme]);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ animation: 'default' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-alarm"
            options={{
              title: 'New Alarm',
              presentation: 'modal',
              headerStyle: { backgroundColor: '#141414' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="alarmScreen"
            options={{
              presentation: 'modal',
              headerShown: false,
              statusBarHidden: true
            }}
          />
        </Stack>
        <Toast config={toastConfig} bottomOffset={120} />
      </GestureHandlerRootView>
    </Provider>
  );
}