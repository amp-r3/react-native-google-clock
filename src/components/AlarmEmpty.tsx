import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function AlarmEmpty () {
  return (
  <View style={{flex: 1,alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120}}>
    <Ionicons name="notifications-off-outline" size={38} color="#f0f0f0" />
    <Text style={{color: '#f0f0f0', fontSize: 52, fontWeight: 600, letterSpacing: -1}}>No alarms</Text>
  </View>
  )
}