import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeColors } from '../theme/colors';
import { useHaptics } from '../hooks/useHaptics';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface OverflowMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: IconName;
  label: string;
  action: 'settings' | 'comingSoon';
}

const ITEMS: MenuItem[] = [
  { icon: 'clock', label: 'Screen saver', action: 'comingSoon' },
  { icon: 'cog-outline', label: 'Settings', action: 'settings' },
  { icon: 'shield-account', label: 'Privacy policy', action: 'comingSoon' },
  { icon: 'bug-outline', label: 'Send feedback', action: 'comingSoon' },
  { icon: 'help-circle', label: 'Help', action: 'comingSoon' },
];

export default function OverflowMenu({ visible, onClose }: OverflowMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { onSelect } = useHaptics();

  const handlePress = (item: MenuItem) => {
    onSelect();
    onClose();
    if (item.action === 'settings') {
      router.push('/settings');
    } else {
      Toast.show({
        type: 'info',
        text1: item.label,
        text2: 'Coming soon',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.menu, { top: insets.top + 4 }]}>
          {ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => handlePress(item)}
            >
              <MaterialCommunityIcons name={item.icon} size={26} color={colors.textSecondary} />
              <Text style={styles.label}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    right: 16,
    minWidth: 280,
    borderRadius: 26,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});
