import * as Haptics from 'expo-haptics';

export function useAlarmHaptics() {
  return {
    onToggle: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    onSave: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    onDelete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  };
}