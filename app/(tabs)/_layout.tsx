import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { TabActions } from "@react-navigation/native";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TABS = [
  { name: "alarm", title: "Alarms", icon: "alarm" },
  { name: "clock", title: "Clocks", icon: "clock-outline" },
  { name: "timer", title: "Timer", icon: "timer-sand-complete" },
  { name: "stopwatch", title: "Stopwatch", icon: "timer-outline" },
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
      duration: 280,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();

    Animated.timing(pillWidth, {
      toValue: layout.width,
      duration: 280,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
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
    const isFocused = state.index === index;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.dispatch(TabActions.jumpTo(route.name));
    }
  };

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: insets.bottom + 4 },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pill,
          { left: pillX, width: pillWidth },
        ]}
      />

      {TABS.map((tab, index) => {
        const isActive = index === state.index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onLayout={(e) => handleLayout(e, index)}
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={tab.icon as IconName}
              size={24}
              color={isActive ? "#FFFFFF" : "#A0A0A0"}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#FFFFFF" : "#A0A0A0" },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  pill: {
    position: "absolute",
    top: 8,
    height: 58,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.12)",
  },

  tab: {
    flex: 1,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    zIndex: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
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