import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatDuration } from "../utils/timeFormat";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeColors } from "../theme/colors";


interface LapItemProps {
  order: number;
  startMs: number;
  finishMs: number;
  isActive?: boolean;
}

export default function LapItem({ order, startMs, finishMs, isActive }: LapItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.lapContainer, isActive && styles.lapContainerActive]}>
      <Text style={styles.lapOrder}>{order.toString().padStart(2, '0')}</Text>
      <Text style={styles.lapStart}>{formatDuration(startMs, { centiseconds: true })}</Text>
      <Text style={styles.lapFinish}>{formatDuration(finishMs, { centiseconds: true })}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  lapContainer: {
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: 18,
    padding: 15,
    gap: 2,
  },
  lapContainerActive: {
    borderColor: colors.accent,
  },
  lapOrder: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lapStart: {
    color: colors.textPrimary,
  },
  lapFinish: {
    color: colors.textSecondary,
  },
})
