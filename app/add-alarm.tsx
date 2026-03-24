import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, TextInput, ScrollView
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function AddAlarmScreen() {
  const router = useRouter()
  const [selectedDays, setSelectedDays] = useState([...DAYS]);
  const [isVibration, setIsVibration] = useState(true);
  const [isWeather, setIsWeather] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Time Row */}
      <View style={styles.timeRow}>
        <View style={styles.timeLeft}>
          <Text style={styles.time}>
            6:00 <Text style={styles.ampm}>AM</Text>
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
              onPress={() => toggleDay(day)}
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
          <Text style={styles.nextAlarmValue}>Tomorrow</Text>
        </View>
        <TouchableOpacity style={styles.setAlarmBtn}>
          <Ionicons name="calendar-outline" size={18} color="#8E8E93" />
          <Text style={styles.setAlarmText}>Set alarm.</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>

        {/* Snooze */}
        <View style={styles.settingsRow}>
          <Ionicons name="bed-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
          <Text style={styles.rowLabel}>Snooze</Text>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {/* Alarm Name */}
        <View style={styles.settingsRow}>
          <Ionicons name="pricetag-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
          <Text style={styles.rowLabel}>Alarm name</Text>
          <TextInput
            style={styles.inlineInput}
            placeholder="Alarm"
            placeholderTextColor="#8E8E93"
            textAlign="right"
          />
        </View>

        <View style={styles.separator} />

        {/* Alarm Sound */}
        <View style={styles.settingsRow}>
          <Ionicons name="notifications-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
          <Text style={styles.rowLabel}>Alarm sound</Text>
          <Text style={styles.rowValue}>Default (Morning{'\n'}Fresh)</Text>
        </View>

        <View style={styles.separator} />

        {/* Vibration */}
        <View style={styles.settingsRow}>
          <Ionicons name="phone-portrait-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
          <Text style={styles.rowLabel}>Vibration</Text>
          <Switch
            value={isVibration}
            onValueChange={setIsVibration}
            trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
            thumbColor={isVibration ? '#fff' : '#636366'}
            style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
          />
        </View>

        <View style={styles.separator} />

        {/* Weather */}
        <View style={styles.settingsRow}>
          <Ionicons name="rainy-outline" size={20} color="#8E8E93" style={styles.rowIcon} />
          <Text style={styles.rowLabel}>Weather forecast</Text>
          <Switch
            value={isWeather}
            onValueChange={setIsWeather}
            trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
            thumbColor={isWeather ? '#fff' : '#636366'}
            style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
          />
        </View>

        <View style={styles.separator} />

        {/* Apps */}
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
        <TouchableOpacity style={styles.cancelButton} onPress={() => { router.back() }}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#141414',
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