import { useState } from "react";
import { useExistingAlarm } from "./useExistingAlarm";
import { AlarmOptions, addAlarm, days, deleteAlarm, editAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

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

  return {
    isEditing, selectedDays, label, time, period, alarmOptions,
    setLabel, setTime, setPeriod,
    toggleDay, handleOptionChange, handleSave, handleDelete,
  };
}