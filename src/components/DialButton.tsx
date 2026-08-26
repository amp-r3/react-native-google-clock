import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode, useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeColors } from "../theme/colors";

interface DialButtonProps {
  label: ReactNode;
  onPress: () => void
}


export function DialButton({ label, onPress }: DialButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {typeof label === typeof MaterialCommunityIcons ?
        <label></label> :
        <Text style={styles.label}>{label}</Text>
      }
    </TouchableOpacity>
  )
}

const createStyles = (colors: ThemeColors) => ({
  button: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: 90,
    width: 90,
    borderRadius: 99,
    backgroundColor: colors.surfaceSecondary,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: 900 as const,
  },
});
