import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS = [
  { name: 'alarm',     title: 'Alarms', icon: 'alarm-outline' },
  { name: 'clock',     title: 'Clocks',      icon: 'time-outline' },
  { name: 'timer',     title: 'Timer',    icon: 'hourglass-outline' },
  { name: 'stopwatch', title: 'Stopwatch',icon: 'stopwatch-outline' },
] as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
          height: 60,
          paddingBottom: insets.bottom
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700'
        },
        tabBarActiveTintColor: '#f5f5f5',
        tabBarInactiveTintColor: '#636366',
        headerShown: false,
      }}
    >
      {TABS.map((tab)=> (
        <Tabs.Screen
        key={tab.name}
        name={tab.name}
        options={{
          title: tab.title,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
            name={tab.icon as IconName}
            size={size}
            color={color}
          />
          ),
        }}
        />
      ))}
    </Tabs>
  )
}
