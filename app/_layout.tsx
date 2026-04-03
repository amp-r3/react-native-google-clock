import { Stack } from "expo-router";
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { persistor, store } from "../src/store/store";
import { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import Toast from 'react-native-toast-message';
import { toastConfig } from "../src/components/ToastConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    setStatusBarStyle('light');
  }, [colorScheme]);

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ animation: 'default' }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="add-alarm"
              options={{
                title: 'New Alarm',
                presentation: 'modal',
                headerStyle: { backgroundColor: '#0F0F0F' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="add-clock"
              options={{
                title: 'New Clock',
                presentation: 'modal',
                headerStyle: { backgroundColor: '#0F0F0F' },
                headerTintColor: '#fff',
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
          </Stack>
          <Toast config={toastConfig} bottomOffset={120} />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}