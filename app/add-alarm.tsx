import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { days } from '../src/store/alarmSlice';
import { getNextAlarmDay, getTimeAsDate } from '../src/utils/alarmUtils';
import { useAlarmForm } from '../src/hooks/useAlarmForm';
import { useAlarmHaptics } from '../src/hooks/useAlarmHaptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

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
    setDate,
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

  const { onToggle, onDelete, onSave } = useAlarmHaptics()

  const { dateLabel } = getNextAlarmDay({ time, period, selectedDays, date: date ? new Date(date) : null })

  const onTestHandle = () => {
    if (isEditing) {
      onToggle();
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
          <TouchableOpacity style={styles.timeLeft} onPress={() => { onToggle(); setShowTimePicker(true) }}>
            <Text style={styles.time}>
              {time} <Text style={styles.ampm}>{period}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeButton} onPress={() => { onToggle(); setShowTimePicker(true) }}>
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
                onPress={() => { onToggle(); toggleDay(day) }}
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
              onPress={handleRemoveScheduled}
            >
              <MaterialCommunityIcons name="calendar-remove" size={18} color="#8E8E93" />
              <Text style={[styles.setAlarmText]}>
                unset alarm
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.setAlarmBtn}
              onPress={() => { onToggle(); setShowDatePicker(true) }}
            >
              <MaterialCommunityIcons name="calendar" size={18} color="#8E8E93" />
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
              <MaterialCommunityIcons name="bed-outline" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Snooze</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus" size={24} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Alarm name */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="alarm" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Alarm name</Text>
              <TextInput
                style={styles.inlineInput}
                placeholder="Enter name"
                onChangeText={setLabel}
                placeholderTextColor="#8E8E93"
                value={label}
                textAlign="right"
                returnKeyType="done"
              />
            </View>
            <View style={styles.separator} />

            {/* Alarm sound */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="alarm-note" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Alarm sound</Text>
              <Text style={styles.rowValue}>Default (Morning Fresh)</Text>
            </View>
            <View style={styles.separator} />

            {/* Vibration */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="vibrate" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Vibration</Text>
              <Switch
                value={alarmOptions.vibration}
                onValueChange={(value) => { onToggle(); handleOptionChange('vibration', value) }}
                trackColor={{ false: '#3A3A3C', true: '#1F1F1F' }}
                thumbColor={alarmOptions.vibration ? '#FFFFFF' : '#636366'}
                style={styles.switchScale}
              />
            </View>
            <View style={styles.separator} />

            {/* Weather forecast */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="weather-cloudy" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Weather forecast</Text>
              <Switch
                value={alarmOptions.weather}
                onValueChange={(value) => { onToggle(); handleOptionChange('weather', value) }}
                trackColor={{ false: '#3A3A3C', true: '#1F1F1F' }}
                thumbColor={alarmOptions.weather ? '#FFFFFF' : '#636366'}
                style={styles.switchScale}
              />
            </View>
            <View style={styles.separator} />

            {/* Apps */}
            <View style={styles.settingsRow}>
              <MaterialCommunityIcons name="application-brackets" size={20} color="#A0A0A0" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Apps</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus" size={24} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Test Alarm */}
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={onTestHandle}
            >
              <MaterialCommunityIcons name="play-circle-outline" size={20} color="#A0A0A0" style={styles.rowIcon} />
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

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
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
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -2.5,
  },
  ampm: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
    marginLeft: 8,
  },
  changeButton: {
    backgroundColor: '#1F1F1F',
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
    color: '#FFFFFF',
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
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  dayChipActive: {
    backgroundColor: '#F0F0F0',
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dayTextActive: {
    color: '#0F0F0F',
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
    color: '#A0A0A0',
    fontSize: 15,
    fontWeight: '500',
  },
  nextAlarmValue: {
    color: '#FFFFFF',
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
    color: '#A0A0A0',
    fontSize: 15,
    fontWeight: '500',
  },

  /* Settings Group */
  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: 370,                    // ≈ 5 опций видно одновременно
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
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },
  rowValue: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'right',
  },
  inlineInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    textAlign: 'right',
    padding: 0,
  },
  switchScale: {
    transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.22)',
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
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E0E0E0',
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#F0F0F0',
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
    color: '#0F0F0F',
    fontSize: 17,
    fontWeight: '700',
  },
});