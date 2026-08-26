import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import SettingsGroup from '../../src/components/SettingsGroup';
import SettingsRow from '../../src/components/SettingsRow';
import { selectThemeMode, setThemeMode, ThemeMode } from '../../src/store/settingsSlice';

const OPTIONS: { mode: ThemeMode; label: string; icon: 'white-balance-sunny' | 'weather-night' | 'theme-light-dark' }[] = [
  { mode: 'light', label: 'Light', icon: 'white-balance-sunny' },
  { mode: 'dark', label: 'Dark', icon: 'weather-night' },
  { mode: 'system', label: 'System default', icon: 'theme-light-dark' },
];

export default function ThemePickerScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const themeMode = useSelector(selectThemeMode);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsGroup>
        {OPTIONS.map((option) => (
          <SettingsRow
            key={option.mode}
            icon={option.icon}
            label={option.label}
            checked={themeMode === option.mode}
            onPress={() => {
              dispatch(setThemeMode(option.mode));
              router.back();
            }}
          />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
