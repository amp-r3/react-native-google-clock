import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alarm } from "../src/store/alarmSlice";
import { useExistingAlarm } from "../src/hooks/useExistingAlarm";
import { useHaptics } from "../src/hooks/useHaptics";

export default function AlarmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const defaultAlarm: Alarm = {
    id: '1',
    time: '06:00',
    period: 'AM',
    label: 'Work',
    days: ['Mo', 'Tu', 'Th', 'Fr', 'Sa'],
    enabled: true,
    date: null,
    options: {
      vibration: true,
      weather: false
    }
  }

  const alarm: Alarm = id ? useExistingAlarm(id) : defaultAlarm
  const { onSave, onDelete } = useHaptics();

  return (
    <View style={styles.root}>

      {/* Time + Label */}
      <View style={styles.content}>
        <Text style={styles.time}>{alarm.time}</Text>
        <Text style={styles.label}>{alarm.label}</Text>
      </View>

      {/* Buttons */}
      <View style={[styles.buttons, { bottom: insets.bottom + 112 }]}>
        <Pressable
          onPress={() => { onSave(); /* handleSnooze */ }}
          style={({ pressed }) => [styles.btn, styles.btnSnooze, pressed && { opacity: 0.8 }]}
        >
          <Text style={[styles.btnText, styles.btnTextSnooze]}>Snooze</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnDismiss, pressed && { opacity: 0.8 }]}
          onPress={() => { onDelete(); router.back(); }}
        >
          <Text style={[styles.btnText, styles.btnTextDismiss]}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  time: {
    color: "#f0f0f0",
    fontSize: 96,
    fontWeight: "600",
    letterSpacing: -1,
  },
  label: {
    color: "#f0f0f0",
    fontSize: 32,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 2,
  },
  btn: {
    flex: 1,
    height: 76,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSnooze: {
    backgroundColor: "#f0f0f0",
  },
  btnDismiss: {
    backgroundColor: "#454545",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 2
  },
  btnTextSnooze: {
    color: "#4d4d4d",
  },
  btnTextDismiss: {
    color: "#dbdbdb",
  },
});