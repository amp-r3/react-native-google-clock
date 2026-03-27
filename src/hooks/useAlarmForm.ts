import { useState } from "react";
import { useExistingAlarm } from "./useExistingAlarm";
import { AlarmOptions, addAlarm, days, deleteAlarm, editAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Platform } from "react-native";

interface UseAlarmFormParams {
  id?: string;
  onSuccess?: () => void;
}

export function useAlarmForm({ id, onSuccess }: UseAlarmFormParams) {
  const existingAlarm = useExistingAlarm(id);
  const isEditing = !!id;
  const dispatch = useDispatch();

  const [selectedDays, setSelectedDays] = useState<days[]>(existingAlarm?.days ?? []);
  const [label, setLabel] = useState(existingAlarm?.label ?? 'New alarm');
  const [time, setTime] = useState(existingAlarm?.time ?? '6:00');
  const [period, setPeriod] = useState<'AM' | 'PM'>(existingAlarm?.period ?? 'AM');
  const [alarmOptions, setAlarmOptions] = useState<AlarmOptions>({
    vibration: existingAlarm?.options?.vibration ?? true,
    weather: existingAlarm?.options?.weather ?? false,
  });
  const [showTimePicker, setShowTimePicker] = useState(false)
  const date = new Date();

  const toggleDay = (day: days) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOptionChange = (key: keyof AlarmOptions, value: boolean) => {
    setAlarmOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!label.trim()) return;

    if (isEditing && id) {
      dispatch(editAlarm({ id, editedAlarm: { days: selectedDays, label, options: alarmOptions, time, period } }));
    } else {
      dispatch(addAlarm({ id: nanoid(), days: selectedDays, time, period, enabled: true, label, options: alarmOptions }));
    }

    onSuccess();
  };

  const handleDelete = () => {
    if (id) dispatch(deleteAlarm({ id }));
    onSuccess();
  };

  const onChange = (_, selectedDate) => {
    if (Platform.OS === 'android') setShowTimePicker(false);

    if (selectedDate) {
      const hours24 = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();

      const currentPeriod = hours24 >= 12 ? 'PM' : 'AM';

      const hours12 = hours24 % 12 || 12;

      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

      setTime(`${hours12}:${displayMinutes}`);
      setPeriod(currentPeriod);
    }
  };

  return {
    isEditing, selectedDays, label, time, period, date, alarmOptions, showTimePicker,
    setLabel, setTime, setPeriod, setShowTimePicker,
    toggleDay, handleOptionChange, handleSave, handleDelete, onChange

  };
}