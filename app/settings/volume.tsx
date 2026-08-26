import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import { selectSettings, setVolume } from '../../src/store/settingsSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VolumeScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { volume } = useSelector(selectSettings);
  const [localVolume, setLocalVolume] = useState(volume);

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{Math.round(localVolume * 100)}%</Text>
      <View style={styles.sliderRow}>
        <MaterialCommunityIcons name="volume-low" size={22} color={colors.textSecondary} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={localVolume}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
          onValueChange={setLocalVolume}
          onSlidingComplete={(v) => dispatch(setVolume(v))}
        />
        <MaterialCommunityIcons name="volume-high" size={22} color={colors.textSecondary} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 32,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  slider: {
    flex: 1,
  },
});
