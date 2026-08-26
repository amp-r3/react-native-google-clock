import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import SettingsGroup from '../../src/components/SettingsGroup';
import SettingsRow from '../../src/components/SettingsRow';
import { selectSettings, setSilenceAfter } from '../../src/store/settingsSlice';

const OPTIONS = [1, 5, 10, 15, 20, 30];

export default function SilenceAfterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { silenceAfterMinutes } = useSelector(selectSettings);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsGroup>
        {OPTIONS.map((minutes) => (
          <SettingsRow
            key={minutes}
            icon="timer-off-outline"
            label={`${minutes} min`}
            checked={silenceAfterMinutes === minutes}
            onPress={() => {
              dispatch(setSilenceAfter(minutes));
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
