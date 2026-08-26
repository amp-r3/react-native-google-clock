import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import SettingsGroup from '../../src/components/SettingsGroup';
import SettingsRow from '../../src/components/SettingsRow';
import {
  selectSettings,
  setDefaultVibrate,
  setGraduallyIncreaseVolume,
  setWeekendAlarmBehavior,
} from '../../src/store/settingsSlice';

const THEME_LABELS: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System default',
};

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const settings = useSelector(selectSettings);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingsGroup>
          <SettingsRow
            icon="theme-light-dark"
            label="Display"
            value={THEME_LABELS[settings.themeMode]}
            onPress={() => router.push('/settings/theme')}
          />
          <SettingsRow
            icon="earth"
            label="Home time zone"
            value={settings.homeTimezoneId ?? 'Not set'}
            onPress={() => router.push('/settings/home-timezone')}
          />
        </SettingsGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarm</Text>
        <SettingsGroup>
          <SettingsRow
            icon="vibrate"
            label="Default vibrate"
            switchValue={settings.defaultVibrate}
            onSwitchChange={(v) => dispatch(setDefaultVibrate(v))}
          />
          <SettingsRow
            icon="volume-medium"
            label="Gradually increase volume"
            switchValue={settings.graduallyIncreaseVolume}
            onSwitchChange={(v) => dispatch(setGraduallyIncreaseVolume(v))}
          />
          <SettingsRow
            icon="bed-outline"
            label="Snooze length"
            value={`${settings.snoozeLengthMinutes} min`}
            onPress={() => router.push('/settings/snooze-length')}
          />
          <SettingsRow
            icon="timer-off-outline"
            label="Silence after"
            value={`${settings.silenceAfterMinutes} min`}
            onPress={() => router.push('/settings/silence-after')}
          />
          <SettingsRow
            icon="calendar-remove"
            label="Silence alarms on weekend"
            switchValue={settings.weekendAlarmBehavior === 'skip'}
            onSwitchChange={(v) => dispatch(setWeekendAlarmBehavior(v ? 'skip' : 'normal'))}
          />
          <SettingsRow
            icon="volume-high"
            label="Alarm volume"
            value={`${Math.round(settings.volume * 100)}%`}
            onPress={() => router.push('/settings/volume')}
          />
        </SettingsGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timer</Text>
        <SettingsGroup>
          <SettingsRow
            icon="music-note"
            label="Timer sound"
            value={settings.timerSoundId}
            onPress={() => router.push('/settings/timer-sound')}
          />
        </SettingsGroup>
      </View>
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
    paddingBottom: 40,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
