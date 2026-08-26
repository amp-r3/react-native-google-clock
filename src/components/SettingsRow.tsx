import { useMemo } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeColors } from '../theme/colors';
import { useHaptics } from '../hooks/useHaptics';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingsRowProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  value?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  checked?: boolean;
  showChevron?: boolean;
  disabled?: boolean;
}

export default function SettingsRow({
  icon,
  label,
  onPress,
  value,
  switchValue,
  onSwitchChange,
  checked,
  showChevron,
  disabled,
}: SettingsRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { onSelect, onToggle } = useHaptics();

  const isSwitchRow = switchValue !== undefined;
  const chevronVisible = showChevron ?? (!!onPress && !isSwitchRow && checked === undefined);

  const content = (
    <>
      <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} style={styles.rowIcon} />
      <Text style={[styles.rowLabel, disabled && styles.rowLabelDisabled]}>{label}</Text>
      {value !== undefined && <Text style={styles.rowValue}>{value}</Text>}
      {isSwitchRow && (
        <Switch
          value={switchValue}
          onValueChange={(v) => {
            onToggle();
            onSwitchChange?.(v);
          }}
          trackColor={{ false: colors.border, true: colors.border }}
          thumbColor={switchValue ? colors.accent : colors.textSecondary}
          disabled={disabled}
          style={styles.switchScale}
        />
      )}
      {checked && <MaterialCommunityIcons name="check" size={22} color={colors.accent} />}
      {chevronVisible && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />}
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={styles.settingsRow}
        onPress={() => {
          onSelect();
          onPress();
        }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.settingsRow}>{content}</View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
    gap: 16,
  },
  rowIcon: {
    width: 24,
    textAlign: 'center',
  },
  rowLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '500',
  },
  rowLabelDisabled: {
    color: colors.textSecondary,
  },
  rowValue: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'right',
  },
  switchScale: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
