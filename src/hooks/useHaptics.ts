import * as Haptics from 'expo-haptics';

export function useHaptics() {
  return {
    // Impact
    onToggle: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    onHeavyPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    onRigidPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),
    onSoftPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),

    // Notification
    onSave: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    onError: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    onDelete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

    // Selection
    onSelect: () => Haptics.selectionAsync(),
  };
}