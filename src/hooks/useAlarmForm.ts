import { useState, useEffect } from "react";
import { useExistingAlarm } from "./useExistingAlarm";
import { AlarmOptions, addAlarm, days, deleteAlarm, editAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import type { ComponentProps } from 'react';
import { getNextAlarmDay } from "../utils/alarmUtils";

type OnChange = NonNullable<ComponentProps<typeof DateTimePicker>['onChange']>;

interface UseAlarmFormParams {
  id?: string;
  onSuccess?: () => void;
}

export function useAlarmForm({ id, onSuccess }: UseAlarmFormParams) {
  const existingAlarm = useExistingAlarm(id);
  const isEditing = !!id;
  const dispatch = useDispatch();

  const [selectedDays, setSelectedDays] = useState<days[]>([]);
  const [label, setLabel] = useState('New alarm');
  const [time, setTime] = useState('6:00');
  const [date, setDate] = useState<string | undefined>(undefined);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [alarmOptions, setAlarmOptions] = useState<AlarmOptions>({
    vibration: true,
    weather: false,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!existingAlarm) return;

    setSelectedDays(existingAlarm.days ?? []);
    setLabel(existingAlarm.label ?? 'New alarm');
    setTime(existingAlarm.time ?? '6:00');
    setPeriod(existingAlarm.period ?? 'AM');
    setAlarmOptions({
      vibration: existingAlarm.options?.vibration ?? true,
      weather: existingAlarm.options?.weather ?? false,
    });

    setDate(existingAlarm.days?.length ? undefined : existingAlarm.date);
  }, [existingAlarm]);

  const handleDateSelection = (selectedDate: Date) => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let validDate = new Date(selectedDate);
    if (validDate < todayMidnight) {
      validDate = new Date(todayMidnight);
    }

    const isToday = validDate.toDateString() === now.toDateString();
    if (isToday) {
      const [hourStr, minuteStr] = time.split(':');
      let hours24 = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);

      if (period === 'PM' && hours24 !== 12) hours24 += 12;
      if (period === 'AM' && hours24 === 12) hours24 = 0;

      const alarmToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours24, minutes);

      if (alarmToday <= now) {
        validDate.setDate(validDate.getDate() + 1);
      }
    }

    const dateIso = validDate.toISOString();
    setDate(dateIso);

    setSelectedDays([]);
  };

  const onChangeDate: OnChange = (_, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      handleDateSelection(selectedDate);
    }
  };

  const handleSave = () => {
    if (!label.trim()) return;

    const result = getNextAlarmDay({
      time,
      period,
      selectedDays,
      date: date ? new Date(date) : null,
    });

    const finalDate = result.isoDate ?? date;

    if (isEditing && id) {
      dispatch(
        editAlarm({
          id,
          editedAlarm: {
            days: selectedDays,
            label,
            options: alarmOptions,
            time,
            period,
            date: finalDate,
          },
        })
      );
    } else {
      dispatch(
        addAlarm({
          id: nanoid(),
          days: selectedDays,
          time,
          period,
          enabled: true,
          label,
          options: alarmOptions,
          date: finalDate,
        })
      );
    }

    onSuccess?.();
  };

  const toggleDay = (day: days) => {
    setDate(undefined);
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOptionChange = (key: keyof AlarmOptions, value: boolean) => {
    setAlarmOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = () => {
    if (id) dispatch(deleteAlarm({ id }));
  };

  const onChangeTime: OnChange = (_, selectedDate) => {
    if (Platform.OS === 'android') setShowTimePicker(false);

    if (selectedDate) {
      const hours24 = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const currentPeriod = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;

      const displayMinutes = String(minutes).padStart(2, '0');

      setTime(`${hours12}:${displayMinutes}`);
      setPeriod(currentPeriod);
    }
  };

  return {
    isEditing,
    selectedDays,
    label,
    time,
    period,
    date,
    alarmOptions,
    showTimePicker,
    showDatePicker,
    setLabel,
    setTime,
    setPeriod,
    setShowTimePicker,
    setShowDatePicker,
    toggleDay,
    handleOptionChange,
    handleSave,
    handleDelete,
    onChangeTime,
    onChangeDate,
  };
}