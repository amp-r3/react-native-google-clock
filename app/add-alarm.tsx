import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { days } from '../src/store/alarmSlice';
import { getNextAlarmDay } from '../src/utils/alarmUtils';
import { useAlarmForm } from '../src/hooks/useAlarmForm';
import { useAlarmHaptics } from '../src/hooks/useAlarmHaptics';

const DAYS: days[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export default function AddAlarmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    selectedDays,
    label,
    setLabel,
    time,
    period,
    toggleDay,
    alarmOptions,
    handleOptionChange,
    handleDelete,
    handleSave,
    isEditing
  } = useAlarmForm({ id, onSuccess: ()=>{router.back()} })

  const { onToggle, onDelete, onSave } = useAlarmHaptics()

  const nextAlarmText = getNextAlarmDay({ time, period, selectedDays })

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: label || 'New alarm' }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time Row */}
        <View style={styles.timeRow}>
          <View style={styles.timeLeft}>
            <Text style={styles.time}>
              {time} <Text style={styles.ampm}>{period}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Days Row */}
        <View style={styles.daysRow}>
          {DAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => {onToggle();toggleDay(day)}}
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
            <Text style={styles.nextAlarmLabel}>Next alarm</Text>
            <Text style={styles.nextAlarmValue}>{nextAlarmText}</Text>
          </View>
          <TouchableOpacity style={styles.setAlarmBtn}>
            <Ionicons name="calendar-outline" size={18} color="#8E8E93" />
            <Text style={styles.setAlarmText}>Set alarm.</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Group */}
        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <Ionicons name="bed-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Snooze</Text>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.settingsRow}>
            <Ionicons name="pricetag-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
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

          <View style={styles.settingsRow}>
            <Ionicons name="notifications-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Alarm sound</Text>
            <Text style={styles.rowValue}>Default (Morning{'\n'}Fresh)</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.settingsRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Vibration</Text>
            <Switch
              value={alarmOptions.vibration}
              onValueChange={(value) => {onToggle();handleOptionChange('vibration', value)}}
              trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
              thumbColor={alarmOptions.vibration ? '#fff' : '#636366'}
              style={styles.switchScale}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingsRow}>
            <Ionicons name="rainy-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Weather forecast</Text>
            <Switch
              value={alarmOptions.weather}
              onValueChange={(value) => {onToggle();handleOptionChange('weather', value)}}
              trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
              thumbColor={alarmOptions.weather ? '#fff' : '#636366'}
              style={styles.switchScale}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingsRow}>
            <Ionicons name="grid-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Apps</Text>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              if (isEditing){
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

          <TouchableOpacity style={styles.saveButton} onPress={()=>{onSave(); handleSave()}}>
            <Text style={styles.saveButtonText}>{isEditing ? 'Save changes' : 'Add alarm'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 20,
  },
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
    letterSpacing: -1,
  },
  ampm: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '400',
  },
  changeButton: {
    backgroundColor: '#3A3A3C',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: '#d4d4d4',
  },
  dayText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#000',
  },
  nextAlarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  nextAlarmLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  nextAlarmValue: {
    color: '#8E8E93',
    fontSize: 14,
  },
  setAlarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setAlarmText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    gap: 12,
  },
  rowIcon: {
    width: 24,
    textAlign: 'center',
  },
  rowLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  rowValue: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'right',
    maxWidth: 160,
  },
  inlineInput: {
    flex: 1,
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'right',
    padding: 0,
  },
  switchScale: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }]
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#38383A',
    marginLeft: 52,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C1A1A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF453A',
    fontSize: 17,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '600',
  },
});