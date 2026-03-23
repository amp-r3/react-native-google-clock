import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  Easing,
} from "react-native";
import { useRef, useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS = [
  { name: "alarm",     title: "Alarms",    icon: "alarm-outline"     },
  { name: "clock",     title: "Clocks",    icon: "time-outline"      },
  { name: "timer",     title: "Timer",     icon: "hourglass-outline" },
  { name: "stopwatch", title: "Stopwatch", icon: "stopwatch-outline" },
] as const;

function AnimatedTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const pillX = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(false);

  const animatePill = (index: number) => {
    const layout = tabLayouts.current[index];
    if (!layout) return;

    Animated.timing(pillX, {
      toValue: layout.x,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(pillWidth, {
      toValue: layout.width,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (!isMounted.current) {
      const layout = tabLayouts.current[state.index];
      if (layout) {
        pillX.setValue(layout.x);
        pillWidth.setValue(layout.width);
      }
      isMounted.current = true;
      return;
    }
    animatePill(state.index);
  }, [state.index]);

  const handleLayout = (e: LayoutChangeEvent, index: number) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[index] = { x, width };

    if (index === state.index) {
      pillX.setValue(x);
      pillWidth.setValue(width);
    }
  };

  const handlePress = (index: number) => {
    const route = state.routes[index];

    navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    navigation.navigate(route.name);
  };

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: insets.bottom + 8 }
      ]}
    >
      <Animated.View style={[styles.pill, { left: pillX, width: pillWidth }]} />

      {TABS.map((tab, index) => {
        const isActive = state.index === index;
        const color = isActive ? "#fff" : "#636366";

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onLayout={(e) => handleLayout(e, index)}
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
          >
            <Ionicons name={tab.icon as IconName} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
    borderTopWidth: 0.2,
    borderTopColor: "rgba(255,255,255, 0.2)",
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  pill: {
    position: "absolute",
    top: 8,
    height: 50,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tab: {
    flex: 1,
    height: 50, 
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}