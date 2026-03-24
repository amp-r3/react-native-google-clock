import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux'
import { store } from "../src/store/store";

export default function RootLayout() { 
  return (
    <Provider store={store}>
    <StatusBar style="light" />
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen name="add-alarm" options={{
        title: 'New Alarm',
        presentation: 'modal',
        headerStyle: { backgroundColor: '#141414' },
        headerTintColor: '#fff'
      }}/>
    </Stack>
    </Provider>
  )
    
}
