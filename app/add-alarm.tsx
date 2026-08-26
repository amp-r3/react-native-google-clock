import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useMemo } from 'react';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { days } from '../src/store/alarmSlice';
import { getNextAlarmDay, getTimeAsDate } from '../src/utils/alarmUtils';
import { useAlarmForm } from '../src/hooks/useAlarmForm';
import { useHaptics } from '../src/hooks/useHaptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useTheme } from '../src/theme/ThemeProvider';
import { ThemeColors } from '../src/theme/colors';

const DAYS: days[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export default function AddAlarmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    selectedDays,
    label,
    time,
    showTimePicker,
    showDatePicker,
    period,
    date,
    isScheduled,
    enabled,
    toggleDay,
    alarmOptions,
    setLabel,
    setShowTimePicker,
    setShowDatePicker,
    handleOptionChange,
    handleDelete,
    handleSave,
    handleRemoveScheduled,
    onChangeTime,
    onChangeDate,
    isEditing,
  } = useAlarmForm({ id, onSuccess: () => { router.back() } })

  const { onToggle, onDelete, onSave, onPress, onSelect, onSoftPress } = useHaptics()
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { dateLabel } = getNextAlarmDay({ time, period, selectedDays, date: date ? new Date(date) : null })

  const onTestHandle = () => {
    if (isEditing) {
      onPress();
      router.push({ pathname: '/alarmScreen', params: { id } });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Save the alarm first to test it.',
        position: 'bottom',
        visibilityTime: 2500,
      });
    }
  }


  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: label || 'New alarm' }} />

      <View style={styles.container}>
        {/* Time Row */}
        <View style={styles.timeRow}>
          <TouchableOpacity style={styles.timeLeft} onPress={() => { onSelect(); setShowTimePicker(true) }}>
            <Text style={styles.time}>
              {time} <Text style={styles.ampm}>{period}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeButton} onPress={() => { onSelect(); setShowTimePicker(true) }}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={getTimeAsDate(time, period)}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onChangeTime}
          />
        )}


        {/* Days Row */}
        <View style={styles.daysRow}>
          {DAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => { onSoftPress(); toggleDay(day) }}
                style={[styles.dayChip, active && styles.dayChipActive]}
              >
                <Text style={[styles.dayText, active && styles.dayTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Alarm Row */}
        <View style={styles.nextAlarmRow}>
          <View>
            {
              enabled ?
                <>
                  <Text style={styles.nextAlarmLabel}>Next alarm</Text>
                  <Text style={styles.nextAlarmValue}>{dateLabel}</Text>
                </>
                :
                <Text style={styles.nextAlarmLabel}>The alarm clock is off</Text>
            }
          </View>

          {isScheduled ? (
            <TouchableOpacity
              style={styles.setAlarmBtn}
              onPress={() => { onDelete(); handleRemoveScheduled() }}
            >
              <MaterialCommunityIcons name="calendar-remove" size={18} color={colors.textSecondary} />
              <Text style={[styles.setAlarmText]}>
                unset alarm
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.setAlarmBtn}
              onPress={() => { onSelect(); setShowDatePicker(true) }}
            >
              <MaterialCommunityIcons name="calendar" size={18} color={colors.textSecondary} />
              <Text style={styles.setAlarmText}>Set alarm.</Text>
            </TouchableOpacity>
          )}
        </View>

        {
          showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )
        }

        {/* Settings Group */}
        <View style={styles.settingsGroup}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.settingsScrollContent}
          >
            {/* Snooze */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="bed-outline" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Snooze</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Alarm name */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="alarm" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Alarm name</Text>
              <TextInput
                style={styles.inlineInput}
                placeholder="Enter name"
                onChangeText={setLabel}
                placeholderTextColor={colors.textSecondary}
                value={label}
                textAlign="right"
                returnKeyType="done"
              />
            </View>
            <View style={styles.separator} />

            {/* Alarm sound */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="alarm-note" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Alarm sound</Text>
              <Text style={styles.rowValue}>Default (Morning Fresh)</Text>
            </View>
            <View style={styles.separator} />

            {/* Vibration */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="vibrate" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Vibration</Text>
              <Switch
                value={alarmOptions.vibration}
                onValueChange={(value) => { onSoftPress(); handleOptionChange('vibration', value) }}
                trackColor={{ false: colors.border, true: colors.border }}
                thumbColor={alarmOptions.vibration ? colors.accent : colors.textSecondary}
                style={styles.switchScale}
              />
            </View>
            <View style={styles.separator} />

            {/* Weather forecast */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="weather-cloudy" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Weather forecast</Text>
              <Switch
                value={alarmOptions.weather}
                onValueChange={(value) => { onSoftPress(); handleOptionChange('weather', value) }}
                trackColor={{ false: colors.border, true: colors.border }}
                thumbColor={alarmOptions.weather ? colors.accent : colors.textSecondary}
                style={styles.switchScale}
              />
            </View>
            <View style={styles.separator} />

            {/* Apps */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="application-brackets" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Apps</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Test Alarm */}
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={onTestHandle}
            >
              <MaterialCommunityIcons name="play-circle-outline" size={20} color={colors.textSecondary} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Test alarm</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              if (isEditing) {
                onDelete()
                handleDelete();

              }
              else {
                onToggle();
                router.back();
              }
            }}
          >
            <Text style={styles.cancelButtonText}>{isEditing ? 'Delete' : 'Cancel'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={() => { onSave(); handleSave() }}>
            <Text style={styles.saveButtonText}>{isEditing ? 'Save changes' : 'Add alarm'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 28,
  },

  /* Time Row */
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  time: {
    color: colors.textPrimary,
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -2.5,
  },
  ampm: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '400',
    marginLeft: 8,
  },
  changeButton: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  changeButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  /* Days */
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  dayChipActive: {
    backgroundColor: colors.accent,
  },
  dayText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dayTextActive: {
    color: colors.background,
  },

  /* Next Alarm */
  nextAlarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  nextAlarmLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  nextAlarmValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  setAlarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  setAlarmText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },

  /* Settings Group */
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: 370,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  settingsScrollContent: {
    paddingBottom: 8,
  },
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
  rowValue: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'right',
  },
  inlineInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 17,
    textAlign: 'right',
    padding: 0,
  },
  switchScale: {
    transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 56,
  },

  /* Bottom Buttons */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
});