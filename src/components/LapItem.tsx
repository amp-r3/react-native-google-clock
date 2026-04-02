import { StyleSheet, Text, View } from "react-native";
import { useStopwatch } from "../hooks/useStopwatch";


interface LapItemProps {
  order: number;
  startMs: number;
  finishMs: number;
  isActive?: boolean;
}

export default function LapItem({ order, startMs, finishMs, isActive }: LapItemProps) {
  const { formatTime } = useStopwatch();

  return (
    <View style={[styles.lapContainer, isActive && styles.lapContainerActive]}>
      <Text style={styles.lapOrder}>{order.toString().padStart(2, '0')}</Text>
      <Text style={styles.lapStart}>{formatTime(startMs)}</Text>
      <Text style={styles.lapFinish}>{formatTime(finishMs)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lapContainer: {
    borderColor: 'rgba(240,240,240, 0.15)',
    borderWidth: 2,
    borderRadius: 18,
    padding: 15,
    gap: 2,
  },
  lapContainerActive: {
    borderColor: 'rgba(255,255,255, 0.4)',
  },
  lapOrder: {
    color: '#8E8E93',
    textAlign: 'center',
  },
  lapStart: {
    color: '#fff'
  },
  lapFinish: {
    color: '#8E8E93'
  },
})