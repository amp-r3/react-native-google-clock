import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import SettingsGroup from '../../src/components/SettingsGroup';
import SettingsRow from '../../src/components/SettingsRow';
import { selectSettings, setTimerSound } from '../../src/store/settingsSlice';

const OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'chimes', label: 'Chimes' },
  { id: 'bells', label: 'Bells' },
];

export default function TimerSoundScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { timerSoundId } = useSelector(selectSettings);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsGroup>
        {OPTIONS.map((option) => (
          <SettingsRow
            key={option.id}
            icon="music-note"
            label={option.label}
            checked={timerSoundId === option.id}
            onPress={() => {
              dispatch(setTimerSound(option.id));
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
