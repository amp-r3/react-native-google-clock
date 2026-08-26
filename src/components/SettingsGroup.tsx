import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeColors } from '../theme/colors';

interface SettingsGroupProps {
  children: React.ReactNode;
}

export default function SettingsGroup({ children }: SettingsGroupProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const rows = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={styles.group}>
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {row}
          {index < rows.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  group: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
});
