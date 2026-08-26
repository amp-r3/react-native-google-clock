import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";


export function AlarmEmpty() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
      <MaterialCommunityIcons name="alarm-off" size={96} color={colors.textSecondary} />
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.textSecondary, marginTop: 24 }}>
        No alarms yet
      </Text>
      <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
        Tap the + button to create your first alarm
      </Text>
    </View>
  )
}
