import { useState, useEffect } from "react";
import { useExistingAlarm } from "./useExistingAlarm";
import { AlarmOptions, addAlarm, days, deleteAlarm, editAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import type { ComponentProps } from 'react';
import { getIsScheduled, getNextAlarmDay, getTimeUntilAlarm } from "../utils/alarmUtils";
import Toast from 'react-native-toast-message';

type OnChange = NonNullable<ComponentProps<typeof DateTimePicker>['onChange']>;

interface UseAlarmFormParams {
  id?: string;
  onSuccess?: () => void;
}

const getDefaultDateTime = (): { time: string; period: 'AM' | 'PM'; date: string } => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(now.getHours() + 1, 0, 0, 0);

  const hours24 = next.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;

  return {
    time: `${hours12}:00`,
    period,
    date: next.toISOString(),
  };
};

const getDefaultDate = (time: string, period: 'AM' | 'PM'): string => {
  const now = new Date();
  const [hourStr, minuteStr] = time.split(':');
  let hours24 = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (period === 'PM' && hours24 !== 12) hours24 += 12;
  if (period === 'AM' && hours24 === 12) hours24 = 0;

  const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours24, minutes);

  if (alarmDate <= now) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }

  return alarmDate.toISOString();
};

export function useAlarmForm({ id, onSuccess }: UseAlarmFormParams) {
  const existingAlarm = useExistingAlarm(id);
  const isEditing = !!id;
  const dispatch = useDispatch();


  const initial = getDefaultDateTime();

  const [selectedDays, setSelectedDays] = useState<days[]>([]);
  const [label, setLabel] = useState('Alarm');
  const [time, setTime] = useState(initial.time);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initial.period);
  const [date, setDate] = useState<string | undefined>(initial.date);
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
  const [alarmOptions, setAlarmOptions] = useState<AlarmOptions>({
    vibration: true,
    weather: false,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!existingAlarm) return;

    setSelectedDays(existingAlarm.days ?? []);
    setLabel(existingAlarm.label ?? 'Alarm');
    setPeriod(existingAlarm.period ?? initial.period);
    setTime(existingAlarm.time ?? initial.time);
    setIsScheduled(getIsScheduled(new Date(existingAlarm.date)))
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
    setIsScheduled(true)
    setDate(validDate.toISOString());
    setSelectedDays([]);
  };

  const onChangeDate: OnChange = (_, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      handleDateSelection(selectedDate);
    }
  };

  const onChangeTime: OnChange = (_, selectedDate) => {
    if (Platform.OS === 'android') setShowTimePicker(false);

    if (selectedDate) {
      const hours24 = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const currentPeriod = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      const displayMinutes = String(minutes).padStart(2, '0');
      const newTime = `${hours12}:${displayMinutes}`;

      setTime(newTime);
      setPeriod(currentPeriod);
      setDate(getDefaultDate(newTime, currentPeriod)); 
    }
  };

  const toggleDay = (day: days) => {
    setDate(undefined);
    setSelectedDays((prev) => {
      const next = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];

      if (next.length === 0) {
        setDate(getDefaultDate(time, period));
      }

      return next;
    });
  };

  const handleRemoveScheduled = () => {
    setIsScheduled(false)
    setDate(getDefaultDate(time, period));
  }

  const handleSave = () => {
    const result = getNextAlarmDay({
      time,
      period,
      selectedDays,
      date: date ? new Date(date) : null,
    });

    const finalDate = result.isoDate ?? date;
    const enabled = !!finalDate || selectedDays.length > 0;

    if (finalDate) {
      Toast.show({
        type: 'info',
        text1: getTimeUntilAlarm(finalDate),
        position: 'bottom',
        visibilityTime: 2500,
      });
    }

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
            enabled,
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
          enabled,
          label,
          options: alarmOptions,
          date: finalDate,
        })
      );
    }

    onSuccess?.();
  };

  const handleOptionChange = (key: keyof AlarmOptions, value: boolean) => {
    setAlarmOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = () => {
    if (id) {
      dispatch(deleteAlarm({ id }));
      Toast.show({
        type: 'info',
        text1: "The alarm has been removed.",
        position: 'bottom',
        visibilityTime: 2500,
        props: {
          onUndo: () => {
            Toast.hide()
            dispatch(addAlarm(existingAlarm));
          },
        },
      });
      onSuccess?.();
    }
  };

  return {
    isEditing,
    selectedDays,
    label,
    time,
    period,
    date,
    isScheduled,
    enabled: existingAlarm?.enabled ?? true,
    alarmOptions,
    showTimePicker,
    showDatePicker,
    setLabel,
    setDate,
    setShowTimePicker,
    setShowDatePicker,
    toggleDay,
    handleOptionChange,
    handleSave,
    handleDelete,
    handleRemoveScheduled,
    onChangeTime,
    onChangeDate,
  };
}