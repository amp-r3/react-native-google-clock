import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";


export function AlarmEmpty() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
      <Ionicons name="alarm-outline" size={96} color="#4A4A4A" />
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#AAAAAA', marginTop: 24 }}>
        No alarms yet
      </Text>
      <Text style={{ fontSize: 16, color: '#666666', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
        Tap the + button to create your first alarm
      </Text>
    </View>
  )
}